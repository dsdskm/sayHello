import GlobalTab from "view/common/GlobalTab";
import * as React from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import AccountDataHook from "api/AccountDataHook";
import { getTimeText } from "common/Utils";
import { TextField } from "@mui/material";
import { Account } from "interface/Account";
import { useNavigate } from "react-router-dom";
import { MARGIN_DEFAULT, PROFILE_IMAGE_HEIGHT, PROFILE_IMAGE_WIDTH, ROUTE_ACCOUNT_EDIT } from "common/Constant";
import ContentWrapper from "component/ContentWrapper";
import TableComponent from "component/TableComponent";
import SearchWrapper from "component/SearchWrapper";
import Loading from "component/Loading";

const COLUMN_NO = "NO";
const COLUMN_NAME = "이름";
const COLUMN_IMAGE = "사진";
const COLUMN_EMAIL = "email";
const COLUMN_PHONE = "전화번호";
const COLUMN_TIME = "날짜";
const KEYWORD_HINT = "이름이나 이메일을 입력하세요";

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
  { id: "image", name: COLUMN_IMAGE, align: "center" },
  { id: "email", name: COLUMN_EMAIL, align: "center" },
  { id: "phone", name: COLUMN_PHONE, align: "center" },
  { id: "time", name: COLUMN_TIME, align: "center" },
];

const AccountListView = () => {
  const navigate = useNavigate();
  const { accountList } = AccountDataHook();
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

  if (!accountList) {
    return <Loading />;
  }

  const onTableRowClick = (value: Account) => {
    goPage(ROUTE_ACCOUNT_EDIT + `/${value.id}`);
  };

  const goPage = (path: string): void => {
    navigate(path);
  };

  return (
    <>
      <GlobalTab />
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
            {accountList &&
              accountList
                .filter((v) => {
                  if (keyword) {
                    return v.name.includes(keyword) || v.email.includes(keyword);
                  } else {
                    return true;
                  }
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((value, index) => {
                  const time = getTimeText(value.time);
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={value.id} onClick={() => onTableRowClick(value)}>
                      <TableCell key={index} align={columns[0].align}>
                        {index + 1}
                      </TableCell>
                      <TableCell key={value.name} align={columns[1].align}>
                        {value.name}
                      </TableCell>
                      <TableCell key={value.image} align={columns[2].align}>
                        <img
                          src={value.image}
                          alt="account"
                          style={{ margin: MARGIN_DEFAULT, width: PROFILE_IMAGE_WIDTH, height: PROFILE_IMAGE_HEIGHT }}
                        />
                      </TableCell>
                      <TableCell key={value.email} align={columns[3].align}>
                        {value.email}
                      </TableCell>
                      <TableCell key={value.phone} align={columns[4].align}>
                        {value.phone}
                      </TableCell>
                      <TableCell key={value.time} align={columns[5].align}>
                        {time}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </TableComponent>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={accountList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ContentWrapper>
      <SearchWrapper>
        <TextField sx={{ width: "300px" }} placeholder={KEYWORD_HINT} onChange={(e) => setKeyword(e.target.value)} />
      </SearchWrapper>
    </>
  );
};

export default AccountListView;
