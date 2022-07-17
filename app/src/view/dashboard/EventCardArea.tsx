import { Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getDayText } from "common/Utils";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ListAltIcon from "@mui/icons-material/ListAlt";
import React from "react";
import { DashBoardProps } from "./Dashboard";
import EventDataHook from "api/EventDataHook";

const EventCardArea: React.FunctionComponent<DashBoardProps> = ({ showingListView, showListView }) => {
  const time = new Date();
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const day = getDayText(time.getDay());
  const timeText = year + "년-" + month + "월-" + date + "일-" + day;

  const { eventList } = EventDataHook("");

  const onCalendarClcik = () => {
    showListView(false);
  };
  const onListClick = () => {
    showListView(true);
  };

  return (
    <>
      <Box>
        <Typography>오늘의 알림</Typography>
        <Typography>{timeText}</Typography>
        {showingListView ? <CalendarMonthIcon onClick={onCalendarClcik} /> : <ListAltIcon onClick={onListClick} />}
        <Box justifyContent="center" sx={{ p: 5, height: "1000px", overflow: "hidden", overflowY: "scroll" }}>
          {eventList
            ?.filter((v) => {
              return v.year === year && v.month === month && v.date === date;
            })
            ?.map((data) => {
              return (
                <>
                  <Card
                    variant="outlined"
                    sx={{
                      minWidth: 200,
                      m: 1,
                      p: 5,
                      border: 1,
                      borderRadius: "20px",
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <img src={data.image} width="100px" height="100px" alt="people" />
                      <Typography variant="h4" sx={{ m: 1 }}>
                        {data.name}님, {data.text}
                      </Typography>
                    </Box>
                  </Card>
                </>
              );
            })}
        </Box>
      </Box>
    </>
  );
};

export default EventCardArea;
