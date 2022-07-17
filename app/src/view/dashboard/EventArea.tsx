import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventDataHook from "api/EventDataHook";
import TableComponent from "component/TableComponent";
import { Button, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { getCalendarEventList, getTimeText } from "common/Utils";
import { deleteEvent, updateEventChecked } from "api/FirebaseApi";
import { CalendarData } from "interface/CalendarData";
import LoadingWrap from "component/LoadingWrap";
import SearchWrapper from "component/SearchWrapper";
import { Box } from "@mui/system";
const COLUMN_NO = "NO";
const COLUMN_NAME = "이름";
const COLUMN_TEXT = "내용";
const COLUMN_TIME = "일정";
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
  { id: "checked", name: COLUMN_CHECKED, align: "center" },
  { id: "delete", name: COLUMN_DELETE, align: "center" },
];
const CalendarArea = () => {
  moment.locale("ko-KR");
  const localizer = momentLocalizer(moment);
  const [updating, setUpdating] = useState(false);
  const [keyword, setKeyword] = useState<string>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [calendarEventList, setCalendarEventList] = useState<Array<CalendarData>>();

  const { eventList } = EventDataHook("");

  useEffect(() => {
    setCalendarEventList(getCalendarEventList(eventList));
  }, [eventList]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onDeleteClick = async (id: string) => {
    if (window.confirm("삭제하시겠습니까?")) {
      setUpdating(true);
      await deleteEvent(id);
      setUpdating(false);
    }
  };
  const onCheckedClick = async (id: string) => {
    if (window.confirm("일정을 확인 하였습니까?")) {
      setUpdating(true);
      await updateEventChecked(id);
      setUpdating(false);
    }
  };
  console.log(`calendarEventList`, calendarEventList);
  return (
    <>
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
                  {columns.map((column) => (
                    <TableCell key={column.name} align={column.align} style={{ minWidth: column.minWidth }}>
                      {column.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {eventList &&
                  eventList
                    .filter((v) => {
                      if (keyword) {
                        return v.name.includes(keyword) || v.text.includes(keyword);
                      } else {
                        return true;
                      }
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((value, index) => {
                      const time = getTimeText(value.eventTime);
                      const bgColor = value.checked ? "green" : "white";
                      return (
                        <TableRow role="checkbox" tabIndex={-1} key={value.id} sx={{ backgroundColor: bgColor }}>
                          <TableCell key={index} align={columns[0].align}>
                            {index + 1}
                          </TableCell>
                          <TableCell key={value.name} align={columns[1].align}>
                            {value.name}
                          </TableCell>
                          <TableCell key={value.text} align={columns[2].align}>
                            {value.text}
                          </TableCell>
                          <TableCell key={value.eventTime} align={columns[3].align}>
                            {time}
                          </TableCell>
                          <TableCell key={(index + 1) * 100} align={columns[4].align}>
                            <Button variant="contained" onClick={() => onCheckedClick(value.id)}>
                              확인
                            </Button>
                          </TableCell>
                          <TableCell key={(index + 1) * 10} align={columns[4].align}>
                            <Button variant="contained" onClick={() => onDeleteClick(value.id)}>
                              삭제
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
            <SearchWrapper>
              <TextField sx={{ width: "300px" }} placeholder={""} onChange={(e) => setKeyword(e.target.value)} />
            </SearchWrapper>
          </Box>
        </>
      )}
    </>
  );
};

export default CalendarArea;
