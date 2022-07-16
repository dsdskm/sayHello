import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import HelloDataHook from "api/HelloDataHook";
import { getTimeText } from "common/Utils";
import TableComponent from "component/TableComponent";
import { useState } from "react";

const COLUMN_NO = "NO";
const COLUMN_NAME = "이름";
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
  { id: "name", name: COLUMN_NAME, align: "center" },
  { id: "text", name: COLUMN_TEXT, align: "center" },
  { id: "time", name: COLUMN_TIME, align: "center" },
  { id: "writer", name: COLUMN_WRITER, align: "center" },
];
const ListArea = () => {
  const { helloList } = HelloDataHook("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  return (
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
                    {value.name}
                  </TableCell>
                  <TableCell key={value.text} align={columns[2].align}>
                    {value.text}
                  </TableCell>
                  <TableCell key={value.time} align={columns[3].align}>
                    {time}
                  </TableCell>
                  <TableCell key={value.writer} align={columns[4].align}>
                    {value.writer}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </TableComponent>
    </>
  );
};

export default ListArea;
