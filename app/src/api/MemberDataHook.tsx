/* eslint-disable react-hooks/exhaustive-deps */
import { db } from "config/FirebaseConfig";
import {collection, getDocs, orderBy, query} from "firebase/firestore";
import { Member } from "interface/Member";
import { useEffect, useState } from "react";
import {COLLECTION_DATA, COLLECTION_MEMBER, MODE} from "./FirebaseApi";

const MemberDataHook = () => {
  const [memberList, setMemberList] = useState<Array<Member>>();

  const fetchingMemberData = async () => {
    const list: Array<Member> = [];
    const q = query(collection(db, COLLECTION_MEMBER, MODE, COLLECTION_DATA), orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const memberData = data as Member;
      if (data) {
        list.push(memberData);
      }
    });
    setMemberList(list);
  };

  useEffect(() => {
    fetchingMemberData();
  }, []);

  return {
    memberList,
  };
};

export default MemberDataHook;
