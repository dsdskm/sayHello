/* eslint-disable */
import { db } from "config/FirebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Member } from "interface/Member";
import { useEffect, useState } from "react";
import { COLLECTION_DATA, COLLECTION_MEMBER, MODE } from "./FirebaseApi";

const MemberDataHook = () => {
  const [memberList, setMemberList] = useState<Array<Member>>();

  useEffect(() => {
    const q = query(collection(db, COLLECTION_MEMBER, MODE, COLLECTION_DATA), orderBy("lastHellotime", "asc"));
    const snapshot = onSnapshot(q, (querySnapshot) => {
      const list: Array<Member> = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const memberData = data as Member;
        if (data) {
          list.push(memberData);
        }
      });
      setMemberList(list);
    });
    return () => snapshot();
  }, []);

  return {
    memberList,
  };
};

export default MemberDataHook;
