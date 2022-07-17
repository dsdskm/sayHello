export interface CalendarData {
  id: number;
  title: string;
  desc: string;
  start: any;
  end: any;
}

export const DEFAULT_CALENDAR_DATA = {
  id: 0,
  title: "",
  desc: "",
  start: new Date(),
  end: new Date(),
};
