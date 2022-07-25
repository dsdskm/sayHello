import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventDataHook from "api/EventDataHook";
import TableComponent from "component/TableComponent";
import {
  Button,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  getCalendarEventList,
  getPhoneFormat,
  getStorage,
  getTimeText,
  KEY_PER_PAGE_DASHBOARD_EVENT,
  setStorage,
} from "common/Utils";
import { deleteEvent, updateEventChecked } from "api/FirebaseApi";
import { CalendarData } from "interface/CalendarData";
import LoadingWrap from "component/LoadingWrap";
import SearchWrapper from "component/SearchWrapper";
import { Box } from "@mui/system";
import CustomLabel, { LABEL_SIZE_SMALL } from "component/Labels";
import { DashBoardProps } from "./DashBoardProps";
import { EventData } from "interface/EventData";

const LABEL_OK = "내용 확인";
const LABEL_DELETE = "삭제";
const LABEL_EVENT = "일정";
const MSG_CHECKED = "일정을 확인하였습니까?";
const MSG_DELETE = "삭제하시겠습니까?";
const COLUMN_NO = "NO";
const COLUMN_NAME = "이름";
const COLUMN_TEXT = "내용";
const COLUMN_TIME = "일정";
const COLUMN_WRITER = "작성자";
const COLUMN_DELETE = "삭제";
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
  { id: "name", name: COLUMN_NAME, align: "center" },
  { id: "text", name: COLUMN_TEXT, align: "center" },
  { id: "time", name: COLUMN_TIME, align: "center" },
  { id: "writer", name: COLUMN_WRITER, align: "center" },
  { id: "checked", name: COLUMN_CHECKED, align: "center" },
  { id: "delete", name: COLUMN_DELETE, align: "center" },
];
const EventArea: React.FunctionComponent<DashBoardProps> = ({ myMemberList, nameList }) => {
  console.log(`EventArea`)
  moment.locale("ko-KR");
  const localizer = momentLocalizer(moment);
  const [updating, setUpdating] = useState(false);
  const [list, setList] = useState<Array<EventData>>([]);
  const [keyword, setKeyword] = useState<string>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(+getStorage(KEY_PER_PAGE_DASHBOARD_EVENT, "10"));
  const [calendarEventList, setCalendarEventList] = useState<Array<CalendarData>>();

  const { eventList } = EventDataHook("", "asc");
  
  useEffect(() => {
    const today = new Date().getTime();
    if (eventList) {
      const tmpList = eventList
        .filter((v) => {
          if (v.eventTime >= today) {
            if (myMemberList && v.member_id in myMemberList) {
              if (keyword) {
                return v.name.includes(keyword) || v.text.includes(keyword);
              } else {
                return true;
              }
            } else {
              return false;
            }
          } else {
            return false;
          }
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
      setList(tmpList);
    }
  }, [eventList, keyword, myMemberList, page, rowsPerPage]);

  useEffect(() => {
    setCalendarEventList(
      getCalendarEventList(
        eventList?.filter((v) => {
          return myMemberList && v.member_id in myMemberList;
        })
      )
    );
  }, [eventList, myMemberList]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setStorage(KEY_PER_PAGE_DASHBOARD_EVENT, event.target.value);
    setPage(0);
  };

  const onDeleteClick = async (id: string) => {
    if (window.confirm(MSG_DELETE)) {
      setUpdating(true);
      await deleteEvent(id);
      setUpdating(false);
    }
  };
  const onCheckedClick = async (id: string) => {
    if (window.confirm(MSG_CHECKED)) {
      setUpdating(true);
      await updateEventChecked(id);
      setUpdating(false);
    }
  };

  return (
    <>
      <CustomLabel label={LABEL_EVENT} size={LABEL_SIZE_SMALL} />
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        events={calendarEventList}
      />
      {updating ? (
        <LoadingWrap />
      ) : (
        <>
          <Box sx={{ p: 1 }}>
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
                {nameList &&
                  list &&
                  list.map((value, index) => {
                    const time = getTimeText(value.eventTime);
                    const bgColor = value.checked ? "green" : "white";
                    return (
                      <TableRow role="checkbox" tabIndex={-1} key={value.id} sx={{ backgroundColor: bgColor }}>
                        <TableCell align={columns[0].align}>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell align={columns[1].align}>{value.name}</TableCell>
                        <TableCell align={columns[2].align}>{value.text}</TableCell>
                        <TableCell align={columns[3].align}>{time}</TableCell>
                        <TableCell align={columns[4].align}>
                          <Typography>{nameList[value.writer][0]}</Typography>
                          <Typography>{getPhoneFormat(nameList[value.writer][1])}</Typography>
                          <Typography>{value.writer}</Typography>
                        </TableCell>
                        <TableCell align={columns[5].align}>
                          <Button variant="contained" onClick={() => onCheckedClick(value.id)}>
                            {LABEL_OK}
                          </Button>
                        </TableCell>
                        <TableCell align={columns[6].align}>
                          <Button
                            sx={{ backgroundColor: "red" }}
                            variant="contained"
                            onClick={() => onDeleteClick(value.id)}
                          >
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
              count={list ? list.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <SearchWrapper>
              <TextField sx={{ width: "300px" }} placeholder={""} onChange={(e) => setKeyword(e.target.value)} />
            </SearchWrapper>
          </Box>
        </>
      )}
    </>
  );
};

export default EventArea;
