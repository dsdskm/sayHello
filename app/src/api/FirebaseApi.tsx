import { auth, db, functions, storage } from "config/FirebaseConfig";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { Account } from "interface/Account";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { LocalFile } from "interface/LocalFile";
import { ACCOUNT_TYPE_NORMAL, DEFAULT_PROFILE_IMAGE } from "common/Constant";
import { httpsCallable } from "firebase/functions";
import emailjs from "emailjs-com";
import { Member } from "interface/Member";
import { DEFAULT_NOTICE_DATA, NoticeData } from "interface/NoticeData";
export const COLLECTION_ACCOUNT = "account";
export const COLLECTION_NOTICE = "notice";
export const COLLECTION_DATA = "data";
export const COLLECTION_MEMBER = "member";
const OP = "op";
const QA = "qa";
export const MODE = QA;
export const emailExistCheck = async (email: string) => {
  const q = query(collection(db, COLLECTION_ACCOUNT), where("email", "==", email));
  let id;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    id = doc.id;
  });
  return id;
};

export const addNotice = async (notice: NoticeData, isAdd: Boolean) => {
  notice.time = new Date().getTime();
  notice.id = isAdd ? notice.time.toString() : notice.id;
  const ref = doc(db, COLLECTION_NOTICE, MODE, COLLECTION_DATA, notice.id);
  if (isAdd) {
    await setDoc(ref, notice);
  } else {
    await updateDoc(ref, {
      title: notice.title,
      contents: notice.contents,
      time: notice.time,
    });
  }
};

export const deleteNotice = async (notice: NoticeData) => {
  const ref = doc(db, COLLECTION_NOTICE, MODE, COLLECTION_DATA, notice.id);
  await deleteDoc(ref);
};

export const addAccount = async (account: Account, localFile: LocalFile, isAdd: Boolean) => {
  try {
    let user;
    if (isAdd) {
      const userCredential = await createUserWithEmailAndPassword(auth, account.email, account.password);
      user = userCredential.user;
    }
    if (user || !isAdd) {
      account.time = new Date().getTime();
      account.id = isAdd ? account.time.toString() : account.id;
      const newPassword = account.password;
      account.password = "";
      account.password_re = "";
      account.type = account.type ? account.type : ACCOUNT_TYPE_NORMAL;
      if (localFile.file) {
        const url = await uploadFile(localFile, "account", account.id);
        account.image = url ? url : DEFAULT_PROFILE_IMAGE;
      }
      const ref = doc(db, COLLECTION_ACCOUNT, account.id);
      if (isAdd) {
        await setDoc(ref, account);
      } else {
        await updateDoc(ref, {
          address: account.address,
          age: account.age,
          image: account.image,
          name: account.name,
          phone: account.phone,
          time: account.time,
        });
        await updateAuth(account.email, newPassword);
      }
    }
    return true;
  } catch (e) {
    return false;
  }
};

const uploadFile = async (file: LocalFile, folder: string, id: string) => {
  const folder_name = `images/${folder}/${id}`;
  const file_object = file.file;
  const file_name = file.name;
  if (!file_name) {
    return "";
  }
  const full_name = folder_name + "/" + file_name;
  const storageRef = ref(storage, full_name);
  await uploadBytes(storageRef, file_object);
  const image_url = await getDownloadURL(storageRef);
  return image_url;
};

export const deleteAccount = async (account: Account) => {
  // real auth
  const deleteAuth = httpsCallable(functions, "deleteAuth");
  const res = await deleteAuth({ email: account.email });
  console.log(`res`, res);
  // auth in db
  await deleteDoc(doc(db, COLLECTION_ACCOUNT, account.id));
};

const updateAuth = async (email: string, newPassword: string) => {
  // encrypt & decrypt 필요
  const updateAuth = httpsCallable(functions, "updatePassword");
  const res = await updateAuth({ email: email, password: newPassword });
  console.log(`res`, res);
  return res.data;
};

const generateRandom = (min: number, max: number) => {
  let ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

const getRandomPassword = () => {
  const len = 6;
  let password = "";
  for (let i = 0; i < len; i++) {
    const num = generateRandom(97, 122);
    password += String.fromCharCode(num);
  }
  return password;
};
export const resetPassword = async (email: string) => {
  const newPassword = getRandomPassword();
  console.log(`newPassword ${newPassword}`);
  await updateAuth(email, newPassword);
  const passwordReset = httpsCallable(functions, "updatePassword");
  const res = await passwordReset({ email: email, password: newPassword });
  console.log(`res`, res);
  const templateParams = {
    reply_to: email,
    message: newPassword,
  };
  emailjs.send("service_0fcb118", "password_reset_template", templateParams, "kPfpSSlMg1_FmZty-").then((res) => {
    console.log(res);
  });
};

export const addMember = async (member: Member, localFile: LocalFile, isAdd: Boolean) => {
  try {
    const time = new Date().getTime();
    if (isAdd) {
      member.id = time.toString();
    }

    if (localFile.file) {
      const url = await uploadFile(localFile, "member", member.id);
      member.image = url ? url : DEFAULT_PROFILE_IMAGE;
    }
    const ref = doc(db, COLLECTION_MEMBER, MODE, COLLECTION_DATA, member.id);
    if (isAdd) {
      member.createTime = time;
      member.updateTime = time;
      await setDoc(ref, member);
    } else {
      member.updateTime = time;
      await updateDoc(ref, {
        name: member.name,
        image: member.image,
        phone: member.phone,
        age: member.age,
        address: member.address,
        latitude: member.latitude,
        longitude: member.longitude,
        lastHellotime: member.lastHellotime,
        accountId: member.accountId,
        writer: member.writer,
        updateTime: member.updateTime,
        memo: member.memo,
      });
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const deleteMember = async (member: Member) => {
  const ref = doc(db, COLLECTION_MEMBER, MODE, COLLECTION_DATA, member.id);
  await deleteDoc(ref);
};

export const searchAddress = async (query: string) => {
  const serachAddress = httpsCallable(functions, "serachAddress");
  const res = await serachAddress({ query: query });
  console.log(`res`, res);
  return res.data;
};
