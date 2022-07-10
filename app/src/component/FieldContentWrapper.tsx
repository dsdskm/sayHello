import { Box } from "@mui/system";

type Props = {
  children: JSX.Element | JSX.Element[];
};
const FieldContentWrapper: React.FC<Props> = ({ children }) => {
  return <Box>{children}</Box>;
};

export default FieldContentWrapper;
