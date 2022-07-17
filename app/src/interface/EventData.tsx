export interface EventData {
  id: string;
  text: string;
  member_id: string;
  name: string;
  year: number;
  month: number;
  date: number;
  hour: number;
  min: number;
  eventTime: number;
  checked: Boolean;
  image: string;
}

export const DEFAULT_EVENT_DATA = {
  id: "",
  text: "",
  member_id: "",
  name: "",
  year: 0,
  month: 0,
  date: 0,
  hour: -1,
  min: -1,
  eventTime: 0,
  checked: false,
  image: "",
};
