/* eslint-disable */
import { Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getDayText } from "common/Utils";
import React from "react";
import EventDataHook from "api/EventDataHook";
import CustomLabel, { LABEL_SIZE_SMALL } from "component/Labels";
import CakeIcon from "@mui/icons-material/Cake";
import CelebrationIcon from "@mui/icons-material/Celebration";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MemberDataHook from "api/MemberDataHook";
import { DashBoardProps } from "./DashBoardProps";

const LABEL_TODAY_NOTICE = "오늘의 알림";
const EventCardArea: React.FunctionComponent<DashBoardProps> = ({ myMemberList }) => {
  const time = new Date();
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const day = getDayText(time.getDay());
  const timeText = year + "년 " + month + "월 " + date + "일" + day;

  const { eventList } = EventDataHook("", "asc");
  const { memberList } = MemberDataHook();

  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  return (
    <>
      <Box>
        <CustomLabel label={LABEL_TODAY_NOTICE} size={LABEL_SIZE_SMALL} />
        <Typography>{timeText}</Typography>
        <Box justifyContent="center" sx={{ p: 5, height: "1000px", overflow: "hidden", overflowY: "scroll" }}>
          {myMemberList &&
            memberList &&
            memberList
              .filter((v) => {
                if (v.id in myMemberList) {
                  const month = +v.age.split("/")[1];
                  const date = +v.age.split("/")[2];
                  return month - 1 === todayMonth && date === todayDate;
                } else {
                  return false;
                }
              })
              .map((data, index) => {
                return (
                  <div key={index}>
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
                        <CelebrationIcon color="primary" sx={{ m: 1 }} />
                        <Typography variant="h4" sx={{ m: 1 }}>
                          {data.name}님의 생일입니다.
                        </Typography>
                        <CakeIcon sx={{ color: "red", m: "1" }} />
                      </Box>
                    </Card>
                  </div>
                );
              })}

          {eventList
            ?.filter((v) => {
              return (
                v.year === year && v.month === month && v.date === date && myMemberList && v.member_id in myMemberList
              );
            })
            ?.map((data, index) => {
              return (
                <div key={index}>
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
                      {data.text.includes("병원") ||
                      data.text.includes("한의원") ||
                      data.text.includes("진료") ||
                      data.text.includes("약국") ? (
                        <LocalHospitalIcon sx={{ color: "green", m: 1 }} />
                      ) : (
                        <></>
                      )}
                      <Typography variant="h5" sx={{ m: 1 }}>
                        {data.name}님, {data.hour}시 {data.min}분, {data.text}
                      </Typography>
                    </Box>
                  </Card>
                </div>
              );
            })}
        </Box>
      </Box>
    </>
  );
};

export default EventCardArea;
