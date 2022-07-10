import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";

type Props = {
  children: JSX.Element | JSX.Element[];
};
const TableComponent: React.FC<Props> = ({ children }) => {
  return (
    <TableContainer sx={{ height: 500, width: "100%" }}>
      <Table stickyHeader aria-label="sticky table">
        {children}
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
