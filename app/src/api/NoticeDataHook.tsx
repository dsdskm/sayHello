/* eslint-disable react-hooks/exhaustive-deps */
import { db } from "config/FirebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { NoticeData } from "interface/NoticeData";
import { useEffect, useState } from "react";
import { COLLECTION_DATA, COLLECTION_NOTICE, MODE } from "./FirebaseApi";

const NoticeDataHook = () => {
  const [noticeList, setNoticeList] = useState<Array<NoticeData>>();

  const fetchingNoticeData = async () => {
    const list: Array<NoticeData> = [];
    const q = query(collection(db, COLLECTION_NOTICE, MODE, COLLECTION_DATA), orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const noticeData = data as NoticeData;
      if (data) {
        list.push(noticeData);
      }
    });
    setNoticeList(list);
  };

  useEffect(() => {
    fetchingNoticeData();
  }, []);

  return {
    noticeList,
  };
};
export default NoticeDataHook;
