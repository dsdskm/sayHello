import GlobalTab from "view/common/GlobalTab";
import * as React from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import MemberDataHook from "api/MemberDataHook";
import { getTimeText } from "common/Utils";
import { Button, TextField } from "@mui/material";
import { Member } from "interface/Member";
import { useNavigate } from "react-router-dom";
import { MARGIN_DEFAULT, PROFILE_IMAGE_HEIGHT, PROFILE_IMAGE_WIDTH, ROUTE_MEMBER_EDIT } from "common/Constant";
import ContentWrapper from "component/ContentWrapper";
import TableComponent from "component/TableComponent";
import SearchWrapper from "component/SearchWrapper";
import Loading from "component/Loading";
import ContentTopWrapper from "component/ContentTopWrapper";

const COLUMN_NO = "NO";
const COLUMN_IMAGE = "사진";
const COLUMN_NAME = "이름";
const COLUMN_AGE = "나이";
const COLUMN_ADDRESS = "주소";
const COLUMN_PHONE = "전화번호";
const COLUMN_LASTHELLO = "마지막 안부 확인";
const COLUMN_ACCOUNTID = "담당자";
interface Column {
  id: string;
  name: string;
  minWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "no", name: COLUMN_NO, align: "center" },
  { id: "image", name: COLUMN_IMAGE, align: "center" },
  { id: "name", name: COLUMN_NAME, align: "center" },
  { id: "age", name: COLUMN_AGE, align: "center" },
  { id: "address", name: COLUMN_ADDRESS, align: "center" },
  { id: "phone", name: COLUMN_PHONE, align: "center" },
  { id: "lastHellotime", name: COLUMN_LASTHELLO, align: "center" },
  { id: "accountId", name: COLUMN_ACCOUNTID, align: "center" },
  // { id: "hello", name: COLUMN_HELLO, align: "center" },
  // { id: "event", name: COLUMN_EVENT, align: "center" },
];

export interface MemberProps {
  member: Member;
}

const MemberListView = () => {
  const navigate = useNavigate();
  const { memberList } = MemberDataHook();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [keyword, setKeyword] = React.useState<string>();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!memberList) {
    return <Loading />;
  }

  const onTableRowClick = (value: Member) => {
    goPage(ROUTE_MEMBER_EDIT + `/${value.id}`);
  };

  const goPage = (path: string): void => {
    navigate(path);
  };

  const onAddClick = () => {
    goPage(ROUTE_MEMBER_EDIT + `/-1`);
  };
  return (
    <>
      <GlobalTab />
      <ContentTopWrapper>
        <Button variant="contained" onClick={onAddClick}>
          등록
        </Button>
      </ContentTopWrapper>
      <ContentWrapper>
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
            {memberList &&
              memberList
                .filter((v) => {
                  if (keyword) {
                    return v.name.includes(keyword);
                  } else {
                    return true;
                  }
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((value, index) => {
                  const lastHellotime = getTimeText(value.lastHellotime);
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => onTableRowClick(value)}>
                      <TableCell key={index} align={columns[0].align}>
                        {index + 1}
                      </TableCell>
                      <TableCell key={value.image} align={columns[1].align}>
                        <img
                          src={value.image}
                          alt="account"
                          style={{
                            margin: MARGIN_DEFAULT,
                            width: PROFILE_IMAGE_WIDTH,
                            height: PROFILE_IMAGE_HEIGHT,
                          }}
                        />
                      </TableCell>
                      <TableCell key={value.name} align={columns[2].align}>
                        {value.name}
                      </TableCell>
                      <TableCell key={value.age} align={columns[3].align}>
                        {value.age}
                      </TableCell>
                      <TableCell key={value.address} align={columns[4].align}>
                        {value.address}
                      </TableCell>
                      <TableCell key={value.phone} align={columns[5].align}>
                        {value.phone}
                      </TableCell>
                      <TableCell key={value.lastHellotime} align={columns[5].align}>
                        {lastHellotime}
                      </TableCell>
                      <TableCell key={value.accountId} align={columns[5].align}>
                        {value.accountId}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </TableComponent>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={memberList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ContentWrapper>
      <SearchWrapper>
        <TextField sx={{ width: "300px" }} placeholder={""} onChange={(e) => setKeyword(e.target.value)} />
      </SearchWrapper>
    </>
  );
};

export default MemberListView;
