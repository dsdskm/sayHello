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
}

export const DEFAULT_EVENT_DATA = {
  id: "",
  text: "",
  member_id: "",
  name: "",
  year: 0,
  month: 0,
  date: 0,
  hour: 0,
  min: 0,
  eventTime: 0,
};
