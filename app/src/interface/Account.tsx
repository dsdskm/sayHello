export interface Account {
  id: string;
  name: string;
  image: string;
  email: string;
  phone: string;
  age: string;
  address: string;
  time: number;
  password: string;
  password_re: string;
}

export const DEFAULT_ACCOUNT_DATA = {
  id: "",
  name: "",
  image: "",
  email: "",
  phone: "",
  age: "",
  address: "",
  time: 0,
  password: "",
  password_re: "",
};
