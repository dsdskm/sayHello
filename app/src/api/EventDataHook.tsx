/* eslint-disable */
import { db } from "config/FirebaseConfig";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { EventData } from "interface/EventData";
import { useEffect, useState } from "react";
import { COLLECTION_DATA, COLLECTION_EVENT, MODE } from "./FirebaseApi";

const EventDataHook = (member_id: string | undefined, order: string | undefined) => {
  const [eventList, setEventList] = useState<Array<EventData>>();
  const orderByOption = order === "desc" ? "desc" : "asc";
  useEffect(() => {
    const q = member_id
      ? query(
          collection(db, COLLECTION_EVENT, MODE, COLLECTION_DATA),
          where("member_id", "==", member_id),
          orderBy("eventTime", orderByOption)
        )
      : query(collection(db, COLLECTION_EVENT, MODE, COLLECTION_DATA), orderBy("eventTime", orderByOption));

    const snapshot = onSnapshot(q, (querySnapshot) => {
      const list: Array<EventData> = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const eventData = data as EventData;
        if (data) {
          list.push(eventData);
        }
      });
      setEventList(list);
    });
    return () => snapshot();
  }, []);

  return {
    eventList,
  };
};
export default EventDataHook;
