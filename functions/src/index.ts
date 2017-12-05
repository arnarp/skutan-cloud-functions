import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp(functions.config().firebase);
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


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

exports.test = functions.https.onRequest(req => 'hello')