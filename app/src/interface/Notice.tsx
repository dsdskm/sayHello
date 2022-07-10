export interface Notice {
  id: string;
  title: string;
  contents: string;
  time: number;
  writer: string;
}

export const DEFAULT_NOTICE_DATA = {
  id: "",
  title: "",
  contents: "",
  time: 0,
  writer: "",
};
