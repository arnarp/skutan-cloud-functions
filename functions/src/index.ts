import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { sendInvitation } from './sendInvitationEmail';
import { firestore } from 'firebase-admin';
import { error } from 'util';
import * as cors from 'cors'
import { UserClaims, CustomerInvitation, Omit, UserRecord } from './model';

admin.initializeApp(functions.config().firebase);

const corsMiddleware = cors({origin: true})

const enum StatusCode {
  Ok = 200,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500
}

exports.onUserCreation = functions.auth.user().onCreate(event => {
  const user = event.data
  const userObject = {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  }
  return admin.database().ref(`/users/${user.uid}`).set(userObject).then(() => {
    return admin.firestore().collection('users').doc(user.uid).set(userObject)
  })
})

exports.onClaimWrite = functions.firestore.document('userClaims/{uid}').onWrite(event => {
  const claims = event.data.data() as UserClaims
  console.log(claims)
  return admin.auth().setCustomUserClaims(event.params.uid, claims)
})

exports.getCustomerInvite = functions.https.onRequest((req, res) => {
  return corsMiddleware(req, res, () => {
    const inviteId: string | undefined = req.query.id
    if (req.method !== 'GET' || inviteId === undefined) {
      return res.sendStatus(StatusCode.BadRequest)
    }
    return firestore().collection('customerInvites').doc(inviteId).get().then(doc => {
      if (!doc.exists) {
        return res.sendStatus(StatusCode.NotFound)
      }
      return res.json(doc.data())
    }).catch(error => {
      console.log(error)
      return res.sendStatus(StatusCode.InternalServerError)
    })
  })
})
exports.acceptCustomerInvite = functions.https.onRequest((req, res) => {
  return corsMiddleware(req, res, () => {
    const inviteId: string | undefined = req.query.id
    const uid: string | undefined = req.query.uid
    if (req.method !== 'POST' || inviteId === undefined || uid === undefined) {
      return res.sendStatus(StatusCode.BadRequest)
    }
    return Promise.all([
      firestore().collection('customerInvites').doc(inviteId).get(),
      firestore().collection('users').doc(uid).get()
    ])
    .then(res => {
      const [inviteDoc, userDoc] = res
      if (!inviteDoc.exists || !userDoc.exists) {
        throw new Error('Not found')
      }
      return {inviteDoc, userDoc}
    })
    .then(res => {
      const invitation = res.inviteDoc.data() as Omit<CustomerInvitation, 'id'>
      const user = res.userDoc.data() as Omit<UserRecord, 'uid'>
      const batch = firestore().batch()
      const claimUpdate: UserClaims = {
        customer: {
          id: invitation.customerId,
          role: invitation.role,
          name: invitation.customerName, 
        }}
      const invitationUpdate: Partial<CustomerInvitation> = {
        usedBy: {
          uid, userDisplayName: user.displayName
        }
      }
      const userUpdate: Partial<UserRecord> = {
        customerId: invitation.customerId
      }
      batch.set(firestore().collection('userClaims').doc(uid), claimUpdate, { merge: true })
      batch.update(res.inviteDoc.ref, invitationUpdate)
      batch.update(res.userDoc.ref, userUpdate)
      return batch.commit()
    })
    .then(value => {
      return res.sendStatus(StatusCode.Ok)
    })
    .catch(error => {
      console.log(error)
      if (error.message === 'Not found') {
        res.sendStatus(StatusCode.NotFound)
      } else {
        return res.sendStatus(StatusCode.InternalServerError)
      }
    })
  })
})

exports.sendInvitationEmail = sendInvitation