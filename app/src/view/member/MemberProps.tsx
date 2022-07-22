import { Member } from "interface/Member";
import { AccountKey } from "./MemberListView";
export interface MemberProps {
  member: Member;
  user: string | undefined;
  nameList: AccountKey | undefined;
}
