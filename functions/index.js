"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var sendInvitationEmail_1 = require("./sendInvitationEmail");
var firebase_admin_1 = require("firebase-admin");
var cors = require("cors");
admin.initializeApp(functions.config().firebase);
var corsMiddleware = cors({ origin: true });
exports.onUserCreation = functions.auth.user().onCreate(function (event) {
    var user = event.data;
    var userObject = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
    };
    return admin.database().ref("/users/" + user.uid).set(userObject).then(function () {
        return admin.firestore().collection('users').doc(user.uid).set(userObject);
    });
});
exports.onClaimWrite = functions.firestore.document('userClaims/{uid}').onWrite(function (event) {
    var claims = event.data.data();
    console.log(claims);
    return admin.auth().setCustomUserClaims(event.params.uid, claims);
});
exports.getCustomerInvite = functions.https.onRequest(function (req, res) {
    return corsMiddleware(req, res, function () {
        var inviteId = req.query.id;
        if (req.method !== 'GET' || inviteId === undefined) {
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
});
exports.acceptCustomerInvite = functions.https.onRequest(function (req, res) {
    return corsMiddleware(req, res, function () {
        var inviteId = req.query.id;
        var uid = req.query.uid;
        if (req.method !== 'POST' || inviteId === undefined || uid === undefined) {
            return res.sendStatus(400 /* BadRequest */);
        }
        return Promise.all([
            firebase_admin_1.firestore().collection('customerInvites').doc(inviteId).get(),
            firebase_admin_1.firestore().collection('users').doc(uid).get()
        ])
            .then(function (res) {
            var inviteDoc = res[0], userDoc = res[1];
            if (!inviteDoc.exists || !userDoc.exists) {
                throw new Error('Not found');
            }
            return { inviteDoc: inviteDoc, userDoc: userDoc };
        })
            .then(function (res) {
            var invitation = res.inviteDoc.data();
            var user = res.userDoc.data();
            var batch = firebase_admin_1.firestore().batch();
            batch.set(firebase_admin_1.firestore().collection('userClaims').doc(uid), (_a = {},
                _a["customer." + invitation.customerId] = {
                    role: invitation.role,
                    name: invitation.customerName,
                },
                _a), { merge: true });
            batch.update(res.inviteDoc.ref, {
                usedBy: {
                    uid: uid, userDisplayName: user.displayName
                }
            });
            batch.update(res.userDoc.ref, {
                customerId: invitation.customerId
            });
            return batch.commit();
            var _a;
        })
            .then(function (value) {
            return res.sendStatus(200 /* Ok */);
        })
            .catch(function (error) {
            console.log(error);
            if (error.message === 'Not found') {
                res.sendStatus(404 /* NotFound */);
            }
            else {
                return res.sendStatus(500 /* InternalServerError */);
            }
        });
    });
});
exports.sendInvitationEmail = sendInvitationEmail_1.sendInvitation;
//# sourceMappingURL=index.js.map