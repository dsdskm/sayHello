import { Paper } from "@mui/material";

type Props = {
  children: JSX.Element | JSX.Element[];
};
const ContentWrapper: React.FC<Props> = ({ children }) => {
  return <Paper sx={{ width: "100%", overflow: "hidden" }}>{children}</Paper>;
};

export default ContentWrapper;
