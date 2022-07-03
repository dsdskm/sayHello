import { auth, db, storage } from "config/FirebaseConfig";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { Account } from "interface/Account";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { LocalFile } from "interface/LocalFile";

export const COLLECTION_ACCOUNT = "account";

export const emailExistCheck = async (email: string) => {
  const q = query(collection(db, COLLECTION_ACCOUNT), where("email", "==", email));
  let id;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    id = doc.id;
  });
  return id;
};

export const addAccount = async (account: Account, localFile: LocalFile) => {
  const userCredential = await createUserWithEmailAndPassword(auth, account.email, account.password);
  const user = userCredential.user;
  if (user) {
    account.time = new Date().getTime();
    account.id = account.time.toString();
    account.password = "";
    account.password_re = "";

    if (localFile) {
      let url = await uploadFile(localFile, account.id);
      account.image = url;
    }
    await setDoc(doc(db, COLLECTION_ACCOUNT, account.id), account);

    return true;
  }
  return false;
};

const uploadFile = async (file: LocalFile, id: string) => {
  const folder_name = `images/account/${id}`;
  const file_object = file.file;
  const file_name = file.name;
  const full_name = folder_name + "/" + file_name;
  const storageRef = ref(storage, full_name);
  await uploadBytes(storageRef, file_object);
  const image_url = await getDownloadURL(storageRef);
  return image_url;
};
