export interface HelloData {
  id: string;
  member_id: string;
  text: string;
  writer: string;
  time: number;
  name:string;
}

export const DEFAULT_HELLO_DATA = {
  id: "",
  member_id: "",
  text: "",
  writer: "",
  time: 0,
  name:""
};
