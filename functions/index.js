"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var sendInvitationEmail_1 = require("./sendInvitationEmail");
var firebase_admin_1 = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
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
exports.getCustomerInvite = functions.https.onRequest(function (req, res) {
    var inviteId = req.query.id;
    if (inviteId === undefined) {
        return res.sendStatus(400 /* BadRequest */);
    }
    return firebase_admin_1.firestore().collection('customerInvites').doc(inviteId).get().then(function (doc) {
        if (!doc.exists) {
            return res.sendStatus(404 /* NotFound */);
        }
        return res.json(doc.data());
    }).catch(function (error) {
        console.log(error);
        return res.sendStatus(500 /* InternalServerError */);
    });
});
exports.sendInvitationEmail = sendInvitationEmail_1.sendInvitation;
//# sourceMappingURL=index.js.map