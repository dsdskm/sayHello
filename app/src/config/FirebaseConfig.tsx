/**
 * forebase sdk guide
 * https://firebase.google.com/docs/build
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvtS09Jh48cuYrKreB3AKgIQ5h5Zgzk9E",
  authDomain: "sayhello-8de64.firebaseapp.com",
  projectId: "sayhello-8de64",
  storageBucket: "sayhello-8de64.appspot.com",
  messagingSenderId: "842804277251",
  appId: "1:842804277251:web:e6623b6ef66c8890dfde36",
  measurementId: "G-SNEHQHSFJF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(); // https://firebase.google.com/docs/auth/web/start
const db = getFirestore(app); // https://firebase.google.com/docs/firestore/quickstart?hl=ko

export { app, analytics, auth, db };
