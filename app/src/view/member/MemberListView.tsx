/* eslint-disable */
import GlobalTab from "view/common/GlobalTab";
import { useState, ChangeEvent, useEffect } from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import MemberDataHook from "api/MemberDataHook";
import { getAge, getPhoneFormat, getTimeText } from "common/Utils";
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { Member } from "interface/Member";
import { useNavigate } from "react-router-dom";
import {
  MARGIN_DEFAULT,
  PROFILE_IMAGE_HEIGHT,
  PROFILE_IMAGE_WIDTH,
  ROUTE_MEMBER_EDIT,
  SEARCH_BAR_WIDTH,
} from "common/Constant";
import ContentWrapper from "component/ContentWrapper";
import TableComponent from "component/TableComponent";
import SearchWrapper from "component/SearchWrapper";
import Loading from "component/Loading";
import ContentTopWrapper from "component/ContentTopWrapper";
import MemberMapView from "./MemberMapView";
import AccountDataHook from "api/AccountDataHook";

const LABEL_ADD = "등록";
const LABEL_MANAGER = "담당자";
const LABEL_ALL = "전체";
const MSG_HINT = "검색어를 입력하세요.";
const COLUMN_NO = "NO";
const COLUMN_IMAGE = "사진";
const COLUMN_NAME = "이름";
const COLUMN_AGE = "나이";
const COLUMN_ADDRESS = "주소";
const COLUMN_MEMO = "메모";
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

export const columns: readonly Column[] = [
  { id: "no", name: COLUMN_NO, align: "center" },
  { id: "image", name: COLUMN_IMAGE, align: "center" },
  { id: "name", name: COLUMN_NAME, align: "center" },
  { id: "age", name: COLUMN_AGE, align: "center" },
  { id: "address", name: COLUMN_ADDRESS, align: "center" },
  { id: "memo", name: COLUMN_MEMO, align: "center" },
  { id: "phone", name: COLUMN_PHONE, align: "center" },
  { id: "lastHellotime", name: COLUMN_LASTHELLO, align: "center" },
  { id: "accountId", name: COLUMN_ACCOUNTID, align: "center" },
];

const MemberListView = () => {
  const navigate = useNavigate();
  const { memberList } = MemberDataHook();
  const { accountList } = AccountDataHook();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState<string>();
  const [selectedManager, setSelecteManager] = useState<string>(LABEL_ALL);

  const handleChange = (event: SelectChangeEvent) => {
    setSelecteManager(event.target.value as string);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
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
          {LABEL_ADD}
        </Button>
      </ContentTopWrapper>
      <ContentWrapper>
        <ContentTopWrapper>
          <FormControl sx={{ m: 1, width: 400 }}>
            <InputLabel id="demo-simple-select-label">{LABEL_MANAGER}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedManager}
              label="Manager"
              onChange={handleChange}
            >
              <MenuItem value={LABEL_ALL}>{LABEL_ALL}</MenuItem>
              {accountList &&
                accountList.map((account) => {
                  return (
                    <MenuItem value={account.email}>
                      {account.name}({account.email})
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </ContentTopWrapper>
        <TableComponent>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell align={column.align} style={{ minWidth: column.minWidth }}>
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
                  } else if (selectedManager && (selectedManager === v.accountId || selectedManager === LABEL_ALL)) {
                    return true;
                  } else {
                    return false;
                  }
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((value, index) => {
                  const lastHellotime = value.lastHellotime === 0 ? "-" : getTimeText(value.lastHellotime);
                  const age = getAge(value.age);
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => onTableRowClick(value)}>
                      <TableCell align={columns[0].align}>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell align={columns[1].align}>
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
                      <TableCell align={columns[2].align}>{value.name}</TableCell>
                      <TableCell align={columns[3].align}>{value.age + ` (${age}세)`}</TableCell>
                      <TableCell align={columns[4].align}>{value.address}</TableCell>
                      <TableCell align={columns[5].align}>{value.memo}</TableCell>
                      <TableCell align={columns[6].align}>{getPhoneFormat(value.phone)}</TableCell>
                      <TableCell align={columns[7].align}>{lastHellotime}</TableCell>
                      <TableCell align={columns[8].align}>{value.accountId}</TableCell>
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
        <TextField
          sx={{ width: SEARCH_BAR_WIDTH }}
          placeholder={MSG_HINT}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </SearchWrapper>
      <MemberMapView />
    </>
  );
};

export default MemberListView;
