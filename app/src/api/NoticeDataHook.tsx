/* eslint-disable react-hooks/exhaustive-deps */
import { db } from "config/FirebaseConfig";
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { NoticeData } from "interface/NoticeData";
import { useEffect, useState } from "react";
import { COLLECTION_DATA, COLLECTION_NOTICE, MODE } from "./FirebaseApi";

const NoticeDataHook = () => {
  const [noticeList, setNoticeList] = useState<Array<NoticeData>>();

  useEffect(() => {
    const list: Array<NoticeData> = [];
    const q = query(collection(db, COLLECTION_NOTICE, MODE, COLLECTION_DATA), orderBy("time", "desc"));
    const snapshot = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const noticeData = data as NoticeData;
        if (data) {
          list.push(noticeData);
        }
      });
      setNoticeList(list);
    });
    return () => snapshot();
  }, []);

  return {
    noticeList,
  };
};
export default NoticeDataHook;
