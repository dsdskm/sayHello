/* eslint-disable */
import { useState } from "react";
import {
  Box,
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
import { DEFAULT_HELLO_DATA, HelloData } from "interface/HelloData";
import { getPhoneFormat, getStorage, getTimeText, KEY_PER_PAGE_MEMBER_HELLO, setStorage } from "common/Utils";
import { addHello, deleteHello, updateLastHelloTime } from "api/FirebaseApi";
import LoadingWrap from "component/LoadingWrap";
import HelloDataHook from "api/HelloDataHook";
import TableComponent from "component/TableComponent";
import { useParams } from "react-router-dom";
import CustomLabel, { LABEL_SIZE_SMALL } from "component/Labels";
import { styled } from "@mui/system";
import { MemberProps } from "../MemberProps";

const MSG_ERROR_TEXT_LEN = "안부를 5자이상 입력하세요.";
const MSG_ERROR_TEXT = "안부를 입력하세요.";
const MSG_DELETE = "삭제하시겠습니까?";
const LABEL_ADD = "등록";
const LABEL_LIST = "안부 내역";
const LABEL_DELETE = "삭제";
const COLUMN_NO = "NO";
const COLUMN_TEXT = "내용";
const COLUMN_TIME = "시간";
const COLUMN_WRITER = "작성자";
const COLUMN_DELETE = "삭제";

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
  { id: "delete", name: COLUMN_DELETE, align: "center" },
];
const FieldWrapper = styled(Paper)({
  margin: 10,
  padding: 50,
  minWidth: 500,
  textAlign: "center",
});

const MemberHelloView: React.FC<MemberProps> = ({ member, user, nameList }) => {
  const [hello, setHello] = useState<HelloData>(DEFAULT_HELLO_DATA);
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(+getStorage(KEY_PER_PAGE_MEMBER_HELLO, "5"));
  const params = useParams();
  if (params.id) {
    hello.member_id = params.id?.toString();
  }
  const { helloList } = HelloDataHook(hello.member_id);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setStorage(KEY_PER_PAGE_MEMBER_HELLO, event.target.value);
    setPage(0);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hello.text = e.target.value;
    setHello({ ...hello });
  };

  const onClick = async () => {
    if (user) {
      if (!hello.text || hello.text.length < 5) {
        alert(MSG_ERROR_TEXT_LEN);
        return;
      }
      setUpdating(true);
      hello.writer = user;
      hello.time = new Date().getTime();
      hello.id = hello.time.toString();
      hello.name = member.name;
      await addHello(hello);
      await updateLastHelloTime(hello.member_id);
      reset();
      setUpdating(false);
    }
  };

  const onDeleteClick = async (id: string) => {
    if (window.confirm(MSG_DELETE)) {
      setUpdating(true);
      await deleteHello(id);
      setUpdating(false);
    }
  };

  const reset = () => {
    hello.time = 0;
    hello.id = "";
    hello.text = "";
    setHello({ ...hello });
  };

  return (
    <>
      <FieldWrapper>
        <CustomLabel label={LABEL_LIST} size={LABEL_SIZE_SMALL} />
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
          <TableBody key="">
            {helloList &&
              nameList &&
              helloList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((value, index) => {
                const time = getTimeText(value.time);
                return (
                  <TableRow hover role="checkbox" tabIndex={index} key={index}>
                    <TableCell align={columns[0].align}>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align={columns[1].align}>{value.text}</TableCell>
                    <TableCell align={columns[2].align}>{time}</TableCell>
                    <TableCell align={columns[3].align}>
                      <Typography>{nameList[value.writer][0]}</Typography>
                      <Typography>{getPhoneFormat(nameList[value.writer][1])}</Typography>
                      <Typography>{value.writer}</Typography>
                    </TableCell>
                    <TableCell align={columns[4].align}>
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
          count={helloList ? helloList.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {updating ? (
          <LoadingWrap />
        ) : (
          <Box display="flex" justifyContent="center" sx={{ m: 1 }}>
            <TextField
              placeholder={MSG_ERROR_TEXT}
              value={hello.text}
              autoComplete="off"
              sx={{ width: "500px" }}
              type="text"
              multiline
              maxRows={10}
              onChange={onChange}
            />
            <Button onClick={onClick} variant="contained">
              {LABEL_ADD}
            </Button>
          </Box>
        )}
      </FieldWrapper>
    </>
  );
};

export default MemberHelloView;
