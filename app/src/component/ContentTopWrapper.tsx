import { Box } from "@mui/system";

type Props = {
  children: JSX.Element | JSX.Element[];
};
const ContentTopWrapper: React.FC<Props> = ({ children }) => {
  return (
    <Box display="flex" justifyContent="end" sx={{ ml: 10, mr: 10 }}>
      {children}
    </Box>
  );
};

export default ContentTopWrapper;
