import {
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TextField,
  Button,
} from "@mui/material";
import NoticeDataHook from "api/NoticeDataHook";
import ContentWrapper from "component/ContentWrapper";
import TableComponent from "component/TableComponent";
import { useNavigate } from "react-router-dom";
import GlobalTab from "view/common/GlobalTab";
import Loading from "component/Loading";
import { ROUTE_NOTICE_EDIT, SEARCH_BAR_WIDTH } from "common/Constant";
import { NoticeData } from "interface/NoticeData";
import { getStorage, getTimeText, KEY_PER_PAGE_NOTICE_LIST, setStorage } from "common/Utils";
import SearchWrapper from "component/SearchWrapper";
import ContentTopWrapper from "component/ContentTopWrapper";
import { useEffect, useState } from "react";

const LABEL_ADD = "등록";
const COLUMN_NO = "NO";
const COLUMN_NAME = "제목";
const COLUMN_TEXT = "내용";
const COLUMN_TIME = "시간";
const COLUMN_WRITER = "작성자";
const KEYWORD_HINT = "제목이나 내용을 입력하세요";

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
];

const NoticeListView = () => {
  const navigate = useNavigate();
  const { noticeList } = NoticeDataHook();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(+getStorage(KEY_PER_PAGE_NOTICE_LIST, "10"));
  const [keyword, setKeyword] = useState<string>();
  const [list, setList] = useState<Array<NoticeData>>([]);

  useEffect(() => {
    if (noticeList) {
      const tmpList = noticeList
        .filter((v) => {
          if (keyword) {
            return v.title.includes(keyword) || v.contents.includes(keyword);
          } else {
            return true;
          }
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
      setList(tmpList);
    }
  }, [noticeList, keyword, page, rowsPerPage]);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setStorage(KEY_PER_PAGE_NOTICE_LIST, event.target.value);
    setPage(0);
  };

  const onTableRowClick = (value: NoticeData) => {
    goPage(ROUTE_NOTICE_EDIT + `/${value.id}`);
  };

  const goPage = (path: string): void => {
    navigate(path);
  };

  const onAddClick = () => {
    goPage(ROUTE_NOTICE_EDIT + `/-1`);
  };

  if (!noticeList) {
    return <Loading />;
  }
  return (
    <>
      <GlobalTab />
      <ContentTopWrapper>
        <Button variant="contained" onClick={onAddClick}>
          {LABEL_ADD}
        </Button>
      </ContentTopWrapper>

      <ContentWrapper>
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
              list.map((value, index) => {
                const time = getTimeText(value.time);
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={value.id} onClick={() => onTableRowClick(value)}>
                    <TableCell align={columns[0].align}>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align={columns[1].align}>{value.title}</TableCell>
                    <TableCell width="500" align={columns[2].align}>
                      <div
                        style={{
                          width: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxLines: 3,
                        }}
                      >
                        {value.contents}
                      </div>
                    </TableCell>
                    <TableCell align={columns[3].align}>{time}</TableCell>
                    <TableCell align={columns[4].align}>{value.writer}</TableCell>
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
          placeholder={KEYWORD_HINT}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </SearchWrapper>
    </>
  );
};

export default NoticeListView;
