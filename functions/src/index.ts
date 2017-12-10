import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { sendInvitation } from './sendInvitationEmail';
import { firestore } from 'firebase-admin';
import { error } from 'util';
admin.initializeApp(functions.config().firebase);
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


const enum StatusCode {
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
    claims: {}
  }
  return admin.database().ref(`/users/${user.uid}`).set(userObject).then(() => {
    return admin.firestore().collection('users').doc(user.uid).set(userObject)
  })
})

exports.onClaimWrite = functions.firestore.document('users/{uid}').onWrite(event => {
  const user = event.data.data()
  console.log(user.claims)
  return admin.auth().setCustomUserClaims(event.params.uid, user.claims)
})

exports.getCustomerInvite = functions.https.onRequest((req, res) => {
  const inviteId: string | undefined = req.query.id
  if (inviteId === undefined) {
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

exports.sendInvitationEmail = sendInvitation