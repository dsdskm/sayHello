import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

const Loading = () => {
  return (
    <Box sx={{ width: "100wh", height: "100vh" }} display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  );
};

export default Loading;
