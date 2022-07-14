import GlobalTab from "../common/GlobalTab";
import { Grid } from "@mui/material";
import React from "react";
import Paper from "@mui/material/Paper";
import { SetStateAction, useState } from "react";
import NoticeArea from "./NoticeArea";
import ListArea from "./ListArea";
import CalendarArea from "./CalendarArea";

export interface DashBoardProps {
  showListView: React.Dispatch<SetStateAction<Boolean | undefined>>;
  showingListView: Boolean | undefined;
}

const Dashboard = () => {
  const [showingListView, showListView] = useState<Boolean>();
  return (
    <>
      <GlobalTab />
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Paper sx={{ minWidth: "500px", textAlign: "center" }}>
            <NoticeArea
              showListView={showListView}
              showingListView={showingListView}
            />
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper sx={{ minWidth: "500px", textAlign: "center" }}>
            {showingListView ? <ListArea /> : <CalendarArea />}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
