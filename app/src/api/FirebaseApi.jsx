import { db } from "../config/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
export const addLoginData = async () => {
  await addDoc(collection(db, "test"), {
    value: "login",
  });
};

export const addLogoutData = async () => {
  await addDoc(collection(db, "test"), {
    value: "logout",
  });
};

export const addLoginFailtData = async () => {
  await addDoc(collection(db, "test"), {
    value: "logfail",
  });
};
