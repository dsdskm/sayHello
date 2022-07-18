export interface Member {
  id: string;
  name: string;
  image: string;
  phone: string;
  age: string;
  address: string;
  latitude: number;
  longitude: number;
  lastHellotime: number;
  accountId: string;
  writer: string;
  createTime: number;
  updateTime: number;
  memo: Array<string>;
}

export const DEFAULT_MEMBER_DATA = {
  id: "",
  name: "",
  image: "",
  phone: "",
  age: "",
  address: "",
  latitude: 0,
  longitude: 0,
  lastHellotime: 0,
  accountId: "",
  writer: "",
  createTime: 0,
  updateTime: 0,
  memo: [],
};
