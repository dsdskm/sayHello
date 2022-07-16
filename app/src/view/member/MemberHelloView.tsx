import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DEFAULT_HELLO_DATA, HelloData } from "interface/HelloData";
import { getStorage, getTimeText, KEY_ACCOUNT } from "common/Utils";
import { addHello, updateLastHelloTime } from "api/FirebaseApi";
import LoadingWrap from "component/LoadingWrap";
import HelloDataHook from "api/HelloDataHook";
import { DEFAULT_MEMBER_DATA, Member } from "interface/Member";
import TableComponent from "component/TableComponent";
import { useParams } from "react-router-dom";
import MemberDataHook from "api/MemberDataHook";

const COLUMN_NO = "NO";
const COLUMN_TEXT = "내용";
const COLUMN_TIME = "시간";
const COLUMN_WRITER = "작성자";
interface Column {
  id: string;
  name: string;
  minWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "no", name: COLUMN_NO, align: "center" },
  { id: "name", name: COLUMN_TEXT, align: "center" },
  { id: "time", name: COLUMN_TIME, align: "center" },
  { id: "writer", name: COLUMN_WRITER, align: "center" },
];

const MemberHelloView = () => {
  const [hello, setHello] = useState<HelloData>(DEFAULT_HELLO_DATA);
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [member, setMember] = useState<Member>(DEFAULT_MEMBER_DATA);
  const params = useParams();
  if (params.id) {
    hello.member_id = params.id?.toString();
    hello.writer = getStorage(KEY_ACCOUNT);
  }
  const { memberList } = MemberDataHook();
  const { helloList } = HelloDataHook(hello.member_id);

  useEffect(() => {
    const data = memberList?.filter((data) => {
      return data.id === params.id;
    });
    if (data) {
      setMember(data[0]);
    }
  }, [helloList]);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hello.text = e.target.value;
    setHello({ ...hello });
  };

  const onClick = async () => {
    if (!hello.text || hello.text.length < 5) {
      alert("안부를 5자 이상 입력하세요.");
      return;
    }
    setUpdating(true);
    hello.time = new Date().getTime();
    hello.id = hello.time.toString();
    hello.name = member.name;
    await addHello(hello);
    await updateLastHelloTime(hello.member_id);
    reset();
    setUpdating(false);
  };

  const reset = () => {
    hello.time = 0;
    hello.id = "";
    hello.text = "";
    setHello({ ...hello });
  };

  return (
    <>
      <Box>
        <Typography>안부 내역</Typography>
        <>
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
              {helloList &&
                helloList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((value, index) => {
                  const time = getTimeText(value.time);
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={value.id}>
                      <TableCell key={index} align={columns[0].align}>
                        {index + 1}
                      </TableCell>
                      <TableCell key={value.text} align={columns[1].align}>
                        {value.text}
                      </TableCell>
                      <TableCell key={value.time} align={columns[2].align}>
                        {time}
                      </TableCell>
                      <TableCell key={value.writer} align={columns[3].align}>
                        {value.writer}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </TableComponent>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={helloList ? helloList.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {updating ? (
            <LoadingWrap />
          ) : (
            <>
              <TextField
                placeholder="안부를 입력하세요."
                value={hello.text}
                autoComplete="off"
                sx={{ width: "100%" }}
                type="text"
                multiline
                maxRows={10}
                onChange={onChange}
              />
              <Box display="flex" justifyContent="end">
                <Button onClick={onClick}>등록</Button>
              </Box>
            </>
          )}
        </>
      </Box>
    </>
  );
};

export default MemberHelloView;
