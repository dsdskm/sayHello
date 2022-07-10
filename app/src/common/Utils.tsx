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
