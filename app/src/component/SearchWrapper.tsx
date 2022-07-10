import { Box } from "@mui/system";

type Props = {
  children: JSX.Element | JSX.Element[];
};
const SearchWrapper: React.FC<Props> = ({ children }) => {
  return (
    <Box sx={{ width: "50wh", m: 5 }} display="flex" justifyContent="center">
      {children}
    </Box>
  );
};

export default SearchWrapper;
