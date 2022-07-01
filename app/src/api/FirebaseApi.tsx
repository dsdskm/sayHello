import { auth, db } from "config/FirebaseConfig";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { Account } from "interface/Account";
import { createUserWithEmailAndPassword } from "firebase/auth";

const COLLECTION_ACCOUNT = "account";

export const emailExistCheck = async (email: string) => {
  const q = query(collection(db, COLLECTION_ACCOUNT), where("email", "==", email));
  let id;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    id = doc.id;
  });
  return id;
};

export const addAccount = async (account: Account) => {
  const userCredential = await createUserWithEmailAndPassword(auth, account.email, account.password);
  const user = userCredential.user;
  if (user) {
    account.time = new Date().getTime();
    const id = account.time.toString();
    account.password = "";
    account.password_re = "";
    await setDoc(doc(db, COLLECTION_ACCOUNT, id), account);
    return true;
  }
  return false;
};
