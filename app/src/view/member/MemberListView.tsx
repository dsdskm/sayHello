/* eslint-disable */
import GlobalTab from "view/common/GlobalTab";
import { useState, ChangeEvent, useEffect } from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import MemberDataHook from "api/MemberDataHook";
import { getAge, getPhoneFormat, getStorage, getTimeText, KEY_PER_PAGE_MEMBER_LIST, setStorage } from "common/Utils";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
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
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "config/FirebaseConfig";

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

export interface AccountKey {
  [key: string]: Array<string>; // mail->name
}

const MemberListView = () => {
  const navigate = useNavigate();
  const { memberList } = MemberDataHook();
  const { accountList } = AccountDataHook();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(+getStorage(KEY_PER_PAGE_MEMBER_LIST, "10"));
  const [keyword, setKeyword] = useState<string>();
  const [selectedManager, setSelecteManager] = useState<string>(LABEL_ALL);
  const [nameList, setNameList] = useState<AccountKey | undefined>();
  const [totalCount, setTotalCount] = useState(0);
  const [list, setList] = useState<Array<Member>>([]);

  useEffect(() => {
    if (memberList) {
      const tmpList = memberList
        .filter((v) => {
          if (keyword) {
            return v.name.includes(keyword) || v.memo.includes(keyword);
          } else if (selectedManager && (selectedManager === v.accountId || selectedManager === LABEL_ALL)) {
            return true;
          } else {
            return false;
          }
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
      setList(tmpList);
    }
  }, [memberList, keyword, page, rowsPerPage]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        if (memberList) {
          const filtered = memberList?.filter((data) => {
            return data.accountId === user.email;
          });
          setTotalCount(filtered.length);
        }
      }
    });
    const initNameList = () => {
      if (accountList) {
        let tmpHash: AccountKey = {};
        accountList.forEach((account) => {
          tmpHash[account.email] = [account.name, account.phone];
        });
        setNameList(tmpHash);
      }
    };

    initNameList();
  }, [accountList, memberList]);
  const handleChange = (event: SelectChangeEvent) => {
    setSelecteManager(event.target.value as string);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setStorage(KEY_PER_PAGE_MEMBER_LIST, event.target.value);
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
      <Typography variant="h4" align="center">
        담당 회원 {totalCount}명
      </Typography>
      <MemberMapView />
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
              <MenuItem value={LABEL_ALL} key="0">
                {LABEL_ALL}
              </MenuItem>
              {accountList &&
                accountList.map((account, index) => {
                  return (
                    <MenuItem value={account.email} key={index}>
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
              {columns.map((column, index) => (
                <TableCell align={column.align} style={{ minWidth: column.minWidth }} key={index}>
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {list &&
              nameList &&
              list.map((value, index) => {
                const lastHellotime = value.lastHellotime === 0 ? "-" : getTimeText(value.lastHellotime);
                const age = getAge(value.age);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={index}
                    key={value.id}
                    onClick={() => onTableRowClick(value)}
                  >
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
                    <TableCell align={columns[5].align}>
                      {value.memo.map((value, index) => {
                        return (
                          <Typography align="left" key={index}>
                            {value}
                          </Typography>
                        );
                      })}
                    </TableCell>
                    <TableCell align={columns[6].align}>{getPhoneFormat(value.phone)}</TableCell>
                    <TableCell align={columns[7].align}>{lastHellotime}</TableCell>
                    <TableCell align={columns[8].align}>
                      <Typography>{nameList[value.accountId][0]}</Typography>
                      <Typography>{getPhoneFormat(nameList[value.accountId][1])}</Typography>
                      <Typography>{value.accountId}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </TableComponent>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={list.length}
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
    </>
  );
};

export default MemberListView;
