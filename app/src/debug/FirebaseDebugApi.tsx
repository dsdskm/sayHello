import { COLLECTION_ACCOUNT } from "api/FirebaseApi";
import { auth, db } from "config/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { Account } from "interface/Account";

export const addAccountList = async (list: Account[]) => {
  const batch = writeBatch(db);
  for (let i = 0; i < list.length; i++) {
    const data = list[i];
    const user = await createUserWithEmailAndPassword(auth, data.email, data.password);
    if (user) {
      const ref = doc(db, COLLECTION_ACCOUNT, data.id);
      batch.set(ref, data);
    }
  }
  await batch.commit();
};

export const deleteDebugAccount = async () => {
  const ref = collection(db, COLLECTION_ACCOUNT);
  const q = query(ref, where("password", "==", "123456"));
  const data = await getDocs(q);
  if (data.docs.length !== 0) {
    for (let i = 0; i < data.docs.length; i++) {
      await deleteDoc(data.docs[i].ref);
    }
  }
};
