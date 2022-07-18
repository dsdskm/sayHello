/* eslint-disable */
import {
  Button,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import CustomLabel, { LABEL_SIZE_SMALL } from "component/Labels";
import { useState } from "react";
import "react-calendar/dist/Calendar.css"; // css import
import { DesktopDatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DEFAULT_EVENT_DATA, EventData } from "interface/EventData";
import { useParams } from "react-router-dom";
import { addEvent, deleteEvent, updateEventChecked } from "api/FirebaseApi";
import LoadingWrap from "component/LoadingWrap";
import TableComponent from "component/TableComponent";
import EventDataHook from "api/EventDataHook";
import { getTimeText } from "common/Utils";
import { MemberProps } from "../MemberProps";

const LABEL_EVENT = "일정";
const LABEL_OK = "확인";
const LABEL_DELETE = "삭제";
const LABEL_ADD = "등록";
const MSG_ERROR_DATE = "날짜를 입력하세요.";
const MSG_ERROR_TIME = "시간을 입력하세요.";
const MSG_ERROR_EVENT = "일정을 입력하세요.";
const MSG_DELETE = "삭제하시겠습니까?";
const MSG_CONFIRM = "일정을 확인 하였습니까?";

const FieldWrapper = styled(Paper)({
  margin: 10,
  padding: 50,
  minWidth: 500,
  textAlign: "center",
});

const COLUMN_NO = "NO";
const COLUMN_TEXT = "내용";
const COLUMN_TIME = "일정";
const COLUMN_DELETE = "삭제";
const COLUMN_WRITER = "작성자";
const COLUMN_CHECKED = "확인";
interface Column {
  id: string;
  name: string;
  minWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}
const columns: readonly Column[] = [
  { id: "no", name: COLUMN_NO, align: "center" },
  { id: "text", name: COLUMN_TEXT, align: "center" },
  { id: "time", name: COLUMN_TIME, align: "center" },
  { id: "writer", name: COLUMN_WRITER, align: "center" },
  { id: "checked", name: COLUMN_CHECKED, align: "center" },
  { id: "delete", name: COLUMN_DELETE, align: "center" },
];

const MemberEventView: React.FC<MemberProps> = ({ member, user }) => {
  const [eventData, setEventData] = useState<EventData>(DEFAULT_EVENT_DATA);
  const [dateEvent, setDateEvent] = useState<Date | null>();
  const [timeEvent, setTimeEvent] = useState<Date | null>();
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const params = useParams();
  const { eventList } = EventDataHook(params.id, "desc");

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
    if (user) {
      if (!dateEvent) {
        alert(MSG_ERROR_DATE);
        return;
      } else if (!timeEvent) {
        alert(MSG_ERROR_TIME);
        return;
      } else if (!eventData.text) {
        alert(MSG_ERROR_EVENT);
        return;
      }
      eventData.id = new Date().getTime().toString();
      eventData.member_id = member.id;
      eventData.name = member.name;
      eventData.image = member.image;
      eventData.writer = user;
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
    }
  };
  const reset = () => {
    setEventData(DEFAULT_EVENT_DATA);
  };

  const onDeleteClick = async (id: string) => {
    if (window.confirm(MSG_DELETE)) {
      setUpdating(true);
      await deleteEvent(id);
      setUpdating(false);
    }
  };
  const onCheckedClick = async (id: string) => {
    if (window.confirm(MSG_CONFIRM)) {
      setUpdating(true);
      await updateEventChecked(id);
      setUpdating(false);
    }
  };

  return (
    <>
      <FieldWrapper>
        <CustomLabel label={LABEL_EVENT} size={LABEL_SIZE_SMALL} />
        <TableComponent>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell align={column.align} style={{ minWidth: column.minWidth }} key={index}>
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {eventList &&
              eventList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((value, index) => {
                const time = getTimeText(value.eventTime);
                const bgColor = value.checked ? "green" : "white";
                return (
                  <TableRow role="checkbox" tabIndex={-1} key={value.id} sx={{ backgroundColor: bgColor }}>
                    <TableCell align={columns[0].align}>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align={columns[1].align}>{value.text}</TableCell>
                    <TableCell align={columns[2].align}>{time}</TableCell>
                    <TableCell align={columns[3].align}>{value.writer}</TableCell>
                    <TableCell align={columns[4].align}>
                      <Button variant="contained" onClick={() => onCheckedClick(value.id)}>
                        {LABEL_OK}
                      </Button>
                    </TableCell>
                    <TableCell align={columns[5].align}>
                      <Button sx={{ color: "red" }} variant="contained" onClick={() => onDeleteClick(value.id)}>
                        {LABEL_DELETE}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </TableComponent>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
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
          {eventData.year > 0 && (
            <Typography>{eventData.year + "년 " + eventData.month + "월 " + eventData.date + "일"}</Typography>
          )}
          {eventData.hour >= 0 && <Typography>{eventData.hour + "시 " + eventData.min + "분"}</Typography>}
        </Box>
        {updating ? (
          <LoadingWrap />
        ) : (
          <Box display="flex" justifyContent="center" sx={{ m: 1 }}>
            <TextField placeholder={MSG_ERROR_EVENT} sx={{ width: "500px" }} onChange={onChange}></TextField>
            <Button onClick={onClick} variant="contained">
              {LABEL_ADD}
            </Button>
          </Box>
        )}
      </FieldWrapper>
    </>
  );
};

export default MemberEventView;
