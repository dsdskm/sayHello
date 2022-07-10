/*
firebase emulators:start --only functions:<FUNCTION_NAME>
*/

const cors = require("cors")({ origin: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const app = admin.initializeApp({
  credential: admin.credential.cert(`./key/sayhello-firebase-adminsdk.json`),
});
const auth = admin.auth();

exports.deleteAuth = functions.https.onCall(async (req, res) => {
  console.log(`deleteAuth`);
  try {
    const email = req.email;
    const userRecord = await auth.getUserByEmail(email);
    await auth.deleteUser(userRecord.uid);

    return 200;
  } catch (e) {
    console.log(e);
    return 400;
  }
});

exports.updatePassword = functions.https.onCall(async (req, res) => {
  console.log(`updatePassword`);
  try {
    const email = req.email;
    const newPassword = req.password; // encrypt & decrypt 필요
    const userRecord = await auth.getUserByEmail(email);
    await auth.updateUser(userRecord.uid, {
      password: newPassword,
    });

    return 200;
  } catch (e) {
    console.log(e);
    return 400;
  }
});
