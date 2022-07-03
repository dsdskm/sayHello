import { auth, db } from "config/FirebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { Account } from "interface/Account";
import { useEffect, useState } from "react";
import { COLLECTION_ACCOUNT } from "./FirebaseApi";

const DataHook = () => {
  const [user, setUser] = useState<User>();
  const [account, setAccount] = useState<Account>();
  const fetchingData = async () => {
    if (user && user.email) {
      const q = query(collection(db, COLLECTION_ACCOUNT), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setAccount(data as Account);
      });
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });

    fetchingData();
    return () => {
      fetchingData();
    };
  }, [user]);

  return {
    account,
  };
};
export default DataHook;
