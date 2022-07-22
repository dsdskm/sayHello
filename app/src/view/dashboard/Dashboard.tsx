import GlobalTab from "../common/GlobalTab";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import EventCardArea from "./EventCardArea";
import HelloArea from "./HelloArea";
import EventArea from "./EventArea";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "config/FirebaseConfig";
import MemberDataHook from "api/MemberDataHook";
import AccountDataHook from "api/AccountDataHook";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ListAltIcon from "@mui/icons-material/ListAlt";

export interface DashBoardProps {
  myMemberList: MemberKey | undefined;
}

interface MemberKey {
  [key: string]: string;
}
const Dashboard = () => {
  const [showingListView, showListView] = useState<Boolean>();
  const { memberList } = MemberDataHook();
  const { accountList } = AccountDataHook();
  const [myMemberList, setMyMemberList] = useState<MemberKey | undefined>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        if (accountList) {
          const account = accountList?.filter((data) => {
            return data.email === user.email;
          });
          if (memberList) {
            let tmp: MemberKey = {};
            memberList.forEach((data) => {
              if (data.accountId === user.email || account[0].type === "master") {
                tmp[data.id] = data.accountId;
              }
            });
            setMyMemberList(tmp);
          }
        }
      }
    });
  }, [memberList, accountList]);

  const onCalendarClcik = () => {
    showListView(false);
  };
  const onListClick = () => {
    showListView(true);
  };

  return (
    <>
      <GlobalTab />
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Paper sx={{ minWidth: "50%", textAlign: "center", overflow: "scroll" }}>
            <EventCardArea myMemberList={myMemberList} />
          </Paper>
        </Grid>
        <Grid item xs={7}>
          {showingListView ? <CalendarMonthIcon onClick={onCalendarClcik} /> : <ListAltIcon onClick={onListClick} />}
          <Paper sx={{ minWidth: "50%", textAlign: "center", overflow: "scroll" }}>
            {showingListView ? <HelloArea myMemberList={myMemberList} /> : <EventArea myMemberList={myMemberList} />}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
