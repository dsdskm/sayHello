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
