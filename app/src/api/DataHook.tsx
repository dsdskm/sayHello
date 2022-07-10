/* eslint-disable react-hooks/exhaustive-deps */
import { auth, db } from "config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query } from "firebase/firestore";
import { Account } from "interface/Account";
import { useEffect, useState } from "react";
import { COLLECTION_ACCOUNT } from "./FirebaseApi";

const DataHook = () => {
  const [account, setAccount] = useState<Account>();
  const [accountList, setAccountList] = useState<Array<Account>>();
  const fetchingAccountData = async (email: string | null) => {
    // currnet account
    const list: Array<Account> = [];
    const q = query(collection(db, COLLECTION_ACCOUNT));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const accountData = data as Account;
      if (data.email === email) {
        setAccount(accountData);
      }
      list.push(accountData);
    });

    setAccountList(list);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchingAccountData(user.email);
      }
    });
  }, [auth]);

  return {
    account,
    accountList,
  };
};
export default DataHook;
