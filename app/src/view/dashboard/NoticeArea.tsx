import { Button, Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getDayText } from "common/Utils";
import { NoticeCard } from "interface/NoticeCard";
import { useEffect, useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ListAltIcon from "@mui/icons-material/ListAlt";
import React from "react";
import { DashBoardProps } from "./Dashboard";

const NoticeArea: React.FunctionComponent<DashBoardProps> = ({
  showingListView,
  showListView,
}) => {
  const time = new Date();
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const day = getDayText(time.getDay());
  const timeText = year + "년-" + month + "월-" + date + "일-" + day;

  // sample data
  const [list, setList] = useState<Array<NoticeCard>>();
  useEffect(() => {
    const initSampleList = () => {
      let list_ = [];
      list_.push({
        id: new Date().getTime().toString(),
        message: "한의원 진료",
        name: "오남일",
        member_id: "1",
        time: new Date().getTime(),
        image:
          "https://w.namu.la/s/f6757e6b39a5392c48be898043e6172b6d90b4f4066f07e9e60ff84022263bbe3d3d8671f4f8b8ec27c8d6d430ed903f85acce86096a385d90cadb65fbdcb87a56709b623c20c61a0aea24d20fd8df41bbcf8758029ef08fdb00a22a4e012076",
        checked: false,
      });
      list_.push({
        id: new Date().getTime().toString(),
        message: "외과 진료",
        name: "이재순",
        member_id: "2",
        time: new Date().getTime(),
        image:
          "https://entertainimg.kbsmedia.co.kr/cms/uploads/BBSIMAGE_20220504134652_d51e619fab27522f9742d8f78ac5aa2f.jpg",
        checked: false,
      });
      list_.push({
        id: new Date().getTime().toString(),
        message: "외과 진료",
        name: "고심두",
        member_id: "3",
        time: new Date().getTime(),
        image:
          "https://entertainimg.kbsmedia.co.kr/cms/uploads/BBSIMAGE_20220504134652_d51e619fab27522f9742d8f78ac5aa2f.jpg",
        checked: false,
      });
      list_.push({
        id: new Date().getTime().toString(),
        message: "한의원 진료",
        name: "백섭일",
        member_id: "4",
        time: new Date().getTime(),
        image:
          "https://entertainimg.kbsmedia.co.kr/cms/uploads/BBSIMAGE_20220504134652_d51e619fab27522f9742d8f78ac5aa2f.jpg",
        checked: false,
      });
      setList(list_);
    };
    initSampleList();
  }, []);

  const onItemClick = () => {};
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
        {showingListView ? (
          <CalendarMonthIcon onClick={onCalendarClcik} />
        ) : (
          <ListAltIcon onClick={onListClick} />
        )}
        <Box
          justifyContent="center"
          sx={{ p: 5, height: 500, overflow: "hidden", overflowY: "scroll" }}
        >
          {list?.map((data) => {
            return (
              <>
                <Card
                  variant="outlined"
                  sx={{
                    minWidth: 200,
                    backgroundColor: "yellow",
                    m: 1,
                    p: 1,
                    border: 1,
                    borderRadius: "20px",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <img
                      src={data.image}
                      width="100px"
                      height="100px"
                      alt="people"
                    />
                    <Typography variant="h4" sx={{ m: 1 }}>
                      {data.name}님의 {data.message}일입니다.
                    </Typography>
                  </Box>

                  <Button
                    size="large"
                    color="primary"
                    variant="contained"
                    sx={{ m: 1 }}
                  >
                    상세보기
                  </Button>
                  <Button
                    size="large"
                    color="primary"
                    variant="contained"
                    sx={{ m: 1 }}
                    onClick={onItemClick}
                  >
                    확인
                  </Button>
                </Card>
              </>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default NoticeArea;
