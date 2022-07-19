import { CalendarData } from "interface/CalendarData";
import { EventData } from "interface/EventData";

export const KEY_PER_PAGE_MEMBER_LIST = "per_page_member_list";
export const KEY_PER_PAGE_MEMBER_HELLO = "per_page_member_hello";
export const KEY_PER_PAGE_MEMBER_EVENT = "per_page_member_event";
export const KEY_PER_PAGE_DASHBOARD_HELLO = "per_page_dashboard_hello";
export const KEY_PER_PAGE_DASHBOARD_EVENT = "per_page_dashboard_event";
export const KEY_PER_PAGE_NOTICE_LIST = "per_page_notice_list";
export const KEY_PER_PAGE_ACCOUNT_LIST = "per_page_account_list";
export const getTimeText = (mil: number) => {
  const date = new Date(mil);
  return date.toLocaleString();
};

export const setStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getStorage = (key: string, def: string) => {
  const val = localStorage.getItem(key);
  if (val) {
    return val;
  } else {
    return def;
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

export const getAge = (value: string) => {
  const today = new Date();
  const ages = value.split("/");
  const age = today.getFullYear() - Number(ages[0]);
  return age;
};

export const getPhoneFormat = (phone: string) => {
  if (phone) {
    if (phone.length === 11 && !phone.includes("-")) {
      return phone.substring(0, 3) + "-" + phone.substring(3, 7) + "-" + phone.substring(7, 11);
    } else {
      return phone;
    }
  } else {
    return "";
  }
};
