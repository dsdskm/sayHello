import { Button, Paper, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { Box, styled } from "@mui/system";
import CustomLabel, { LABEL_SIZE_SMALL } from "component/Labels";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // css import
import { DesktopDatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DEFAULT_EVENT_DATA, EventData } from "interface/EventData";
import { useParams } from "react-router-dom";
import MemberDataHook from "api/MemberDataHook";
import { DEFAULT_MEMBER_DATA, Member } from "interface/Member";
import { addEvent } from "api/FirebaseApi";
import LoadingWrap from "component/LoadingWrap";
import TableComponent from "component/TableComponent";
import EventDataHook from "api/EventDataHook";
import { getTimeText } from "common/Utils";

const LABEL_EVENT = "일정";
const FieldWrapper = styled(Paper)({
  margin: 10,
  padding: 50,
  minWidth: 500,
  textAlign: "center",
});

const COLUMN_NO = "NO";
const COLUMN_NAME = "이름";
const COLUMN_TEXT = "내용";
const COLUMN_TIME = "일정";
interface Column {
  id: string;
  name: string;
  minWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}
const columns: readonly Column[] = [
  { id: "no", name: COLUMN_NO, align: "center" },
  { id: "name", name: COLUMN_NAME, align: "center" },
  { id: "text", name: COLUMN_TEXT, align: "center" },
  { id: "time", name: COLUMN_TIME, align: "center" },
];

const MemberCalendarView = () => {
  const [eventData, setEventData] = useState<EventData>(DEFAULT_EVENT_DATA);
  const [member, setMember] = useState<Member>(DEFAULT_MEMBER_DATA);
  const [dateEvent, setDateEvent] = useState<Date | null>();
  const [timeEvent, setTimeEvent] = useState<Date | null>();
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const params = useParams();
  const { memberList } = MemberDataHook();
  const { eventList } = EventDataHook(params.id);
  useEffect(() => {
    const data = memberList?.filter((data) => {
      return data.id === params.id;
    });
    if (data) {
      setMember(data[0]);
    }
  }, [memberList]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onDateChange = (e: Date | null) => {
    if (e) {
      const year = e.getFullYear();
      const month = e.getMonth() + 1;
      const date = e.getDate();

      eventData.year = year;
      eventData.month = month;
      eventData.date = date;
      setEventData({ ...eventData });
      setDateEvent(e);
    }
  };

  const onTimeChange = (e: Date | null) => {
    if (e) {
      const hour = e.getHours();
      const min = e.getMinutes();
      eventData.hour = hour;
      eventData.min = min;
      setEventData({ ...eventData });
      setTimeEvent(e);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    eventData.text = e.target.value;
    setEventData({ ...eventData });
  };

  const onClick = async () => {
    eventData.id = new Date().getTime().toString();
    eventData.member_id = member.id;
    eventData.name = member.name;
    if (!dateEvent) {
      alert("날짜를 선택하세요.");
      return;
    } else if (!timeEvent) {
      alert("시간을 선택하세요.");
      return;
    } else if (!eventData.text) {
      alert("일정을 입력하세요.");
      return;
    }

    const eventTime = new Date();
    eventTime.setFullYear(eventData.year);
    eventTime.setMonth(eventData.month - 1);
    eventTime.setDate(eventData.date);
    eventTime.setHours(eventData.hour);
    eventTime.setMinutes(eventData.min);
    eventData.eventTime = eventTime.getTime();
    setUpdating(true);
    await addEvent(eventData);
    reset();
    setUpdating(false);
  };
  const reset = () => {
    setEventData(DEFAULT_EVENT_DATA);
  };

  return (
    <>
      <FieldWrapper>
        <CustomLabel label={LABEL_EVENT} size={LABEL_SIZE_SMALL} />
        <TableComponent>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.name} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {eventList &&
              eventList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((value, index) => {
                const time = getTimeText(value.eventTime);
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={value.id}>
                    <TableCell key={index} align={columns[0].align}>
                      {index + 1}
                    </TableCell>
                    <TableCell key={value.name} align={columns[1].align}>
                      {value.name}
                    </TableCell>
                    <TableCell key={value.text} align={columns[2].align}>
                      {value.text}
                    </TableCell>
                    <TableCell key={value.date} align={columns[3].align}>
                      {time}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </TableComponent>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={eventList ? eventList.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box sx={{ m: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={LABEL_EVENT}
              inputFormat="yyyy/MM/dd"
              value={dateEvent}
              onChange={onDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              label={LABEL_EVENT}
              inputFormat="HH:mm"
              value={timeEvent}
              onChange={onTimeChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        {updating ? (
          <LoadingWrap />
        ) : (
          <Box display="flex" justifyContent="center" sx={{ m: 1 }}>
            <TextField placeholder="일정을 입력하세요." sx={{ width: "500px" }} onChange={onChange}></TextField>
            <Button onClick={onClick} variant="contained">
              등록
            </Button>
          </Box>
        )}
      </FieldWrapper>
    </>
  );
};

export default MemberCalendarView;
