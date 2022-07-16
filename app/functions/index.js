/*
firebase emulators:start --only functions:<FUNCTION_NAME>
*/

const cors = require("cors")({ origin: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { default: axios } = require("axios");
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

const NAVER_CLIENT_ID = "etof35xz0i";
const NAVER_CLIENT_SECRET = "lIS6YC9jhNh50KC5FeZxqUnKbJVD7PBcbN6iRUfl";
const NAVER_GEO_URL = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";
exports.serachAddress = functions.https.onCall(async (req, res) => {
  const query = req.query;
  console.log(`query=${query}`);

  const ret = await axios.get(NAVER_GEO_URL, {
    params: {
      query,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json;charset=UTF-8",
      "X-NCP-APIGW-API-KEY-ID": `${NAVER_CLIENT_ID}`,
      "X-NCP-APIGW-API-KEY": `${NAVER_CLIENT_SECRET}`,
    },
  });

  return ret.data
});
