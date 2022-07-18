import GlobalTab from "../common/GlobalTab";
import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import Paper from "@mui/material/Paper";
import { SetStateAction, useState } from "react";
import EventCardArea from "./EventCardArea";
import HelloArea from "./HelloArea";
import EventArea from "./EventArea";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "config/FirebaseConfig";
import MemberDataHook from "api/MemberDataHook";
import AccountDataHook from "api/AccountDataHook";

export interface DashBoardProps {
  showListView: React.Dispatch<SetStateAction<Boolean | undefined>>;
  showingListView: Boolean | undefined;
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
  return (
    <>
      <GlobalTab />
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Paper sx={{ minWidth: "500px", textAlign: "center" }}>
            <EventCardArea showListView={showListView} showingListView={showingListView} myMemberList={myMemberList} />
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper sx={{ minWidth: "500px", textAlign: "center" }}>
            {showingListView ? (
              <HelloArea showListView={showListView} showingListView={showingListView} myMemberList={myMemberList} />
            ) : (
              <EventArea showListView={showListView} showingListView={showingListView} myMemberList={myMemberList} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
