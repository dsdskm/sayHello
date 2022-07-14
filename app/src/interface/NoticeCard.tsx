export interface NoticeCard {
  id: string;
  message: string;
  name: string;
  member_id: string;
  time: number;
  image: string;
  checked: Boolean;
}

export const DEFAULT_NOTICE_CARD_DATA = {
  id: "",
  message: "",
  name: "",
  member_id: "",
  time: 0,
  image: "",
  checked: false,
};
