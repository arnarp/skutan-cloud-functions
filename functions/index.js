"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
exports.onUserCreation = functions.auth.user().onCreate(function (event) {
    var user = event.data;
    var userObject = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        claims: {}
    };
    return admin.database().ref("/users/" + user.uid).set(userObject).then(function () {
        return admin.firestore().collection('users').doc(user.uid).set(userObject);
    });
});
exports.onClaimWrite = functions.firestore.document('users/{uid}').onWrite(function (event) {
    var user = event.data.data();
    console.log(user.claims);
    return admin.auth().setCustomUserClaims(event.params.uid, user.claims);
});
exports.test = functions.https.onRequest(function (req) { return 'hello'; });
//# sourceMappingURL=index.js.map