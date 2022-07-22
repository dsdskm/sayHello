import { AccountKey } from "view/member/MemberListView";

export interface MemberKey {
  [key: string]: string;
}

export interface DashBoardProps {
  myMemberList: MemberKey | undefined;
  nameList: AccountKey | undefined;
}
