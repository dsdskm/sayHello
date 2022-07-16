import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

const LoadingWrap = () => {
  return (
    <Box sx={{ width: "100wh" }} display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  );
};

export default LoadingWrap;
