export interface Member {
  id: string;
  name: string;
  image: string;
  email: string;
  phone: string;
  age: string;
  address: string;
  lastHellotime: number;
  accountId: string;
  creater: string;
  createTime: number;
  updater: string;
  updateTime: number;
}

export const DEFAULT_MEMBER_DATA = {
  id: "",
  name: "",
  image: "",
  email: "",
  phone: "",
  age: "",
  address: "",
  lastHellotime: new Date(),
  accountId: "",
  creater: "",
  createTime: 0,
  updater: "",
  updateTime: 0
};
