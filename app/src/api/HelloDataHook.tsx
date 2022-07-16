/* eslint-disable react-hooks/exhaustive-deps */
import { db } from "config/FirebaseConfig";
import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { HelloData } from "interface/HelloData";
import { NoticeData } from "interface/NoticeData";
import { useEffect, useState } from "react";
import { COLLECTION_DATA, COLLECTION_HELLO, MODE } from "./FirebaseApi";

const HelloDataHook = (member_id: string) => {
  const [helloList, setHelloList] = useState<Array<HelloData>>();

  useEffect(() => {
    const list: Array<HelloData> = [];

    const q = member_id
      ? query(
          collection(db, COLLECTION_HELLO, MODE, COLLECTION_DATA),
          where("member_id", "==", member_id),
          orderBy("time", "desc")
        )
      : query(collection(db, COLLECTION_HELLO, MODE, COLLECTION_DATA), orderBy("time", "desc"));

    const snapshot = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const helloData = data as HelloData;
        if (data) {
          list.push(helloData);
        }
      });
      setHelloList(list);
    });
    return () => snapshot();
  }, []);

  return {
    helloList,
  };
};
export default HelloDataHook;
