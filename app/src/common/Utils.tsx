import { CalendarData } from "interface/CalendarData";
import { EventData } from "interface/EventData";

export const KEY_ACCOUNT = "account";
export const getTimeText = (mil: number) => {
  const date = new Date(mil);
  return date.toLocaleString();
};

export const setStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getStorage = (key: string) => {
  const val = localStorage.getItem(key);
  if (val) {
    return val;
  } else {
    return "";
  }
};

export const getDayText = (day: number) => {
  switch (day) {
    case 0:
      return "일요일";
    case 1:
      return "월요일";
    case 2:
      return "화요일";
    case 3:
      return "수요일";
    case 4:
      return "목요일";
    case 5:
      return "금요일";
    case 6:
      return "토요일";
    default:
      break;
  }
  return "일요일";
};

export const getCalendarEventList = (eventList: Array<EventData> | undefined) => {
  const list: Array<CalendarData> = [];
  if (eventList) {
    eventList.forEach((data, index) => {
      const date = new Date();
      const startDate = date;
      startDate.setFullYear(data.year);
      startDate.setMonth(data.month - 1);
      startDate.setDate(data.date);
      startDate.setHours(data.hour);
      startDate.setMinutes(data.min);
      const c = {
        id: index,
        title: `[${data.name}]${data.text}`,
        desc: data.text,
        start: startDate,
        end: startDate,
      } as CalendarData;
      list.push(c);
    });
  }

  return list;
};
