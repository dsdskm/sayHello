import { Button, Grid, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import { Typography } from "@material-ui/core";
import { ROUTE_LOGIN } from "common/Constant";
import { useState } from "react";
import { addAccount, emailExistCheck } from "api/FirebaseApi";
import { useNavigate } from "react-router-dom";
import { Account } from "interface/Account";

const ID_NAME = "name";
const ID_EMAIL = "email";
const ID_PHONE = "phone";
const ID_PASSWORD = "password";
const ID_PASSWORD_RE = "password_re";
const ID_AGE = "age";
const ID_ADDRESS = "address";
const MSG_ERR_EMPTY = "입력하세요";
const MSG_ERR_ENABLE = "사용 가능";
const MSG_ERR_DISABLE = "사용 불가능";
const MSG_ERR_UNCHECKED = "인증 필요";
const MSG_EMAIL_DISABLE = "이미 존재하는 아이디 입니다.";
const MSG_EMAIL_ENABLE = "사용 가능한 아이디 입니다.";
const MSG_JOIN_COMPLETED = "가입이 완료되었습니다.";
const MSG_JOIN_FAILED = "가입에 실패하였습니다.";
const MSG_ERR_EMPTY_NAME = "이름을 입력하세요.";
const MSG_ERR_EMPTY_EMAIL = "이메일을 입력하세요.";
const MSG_ERR_EMPTY_PHONE = "연락처를 입력하세요.";
const MSG_ERR_EMPTY_PASSWORD = "비밀번호를 입력하세요.";
const MSG_ERR_EMPTY_PASSWORD2 = "비밀번호가 일치하지 않습니다.";
const MSG_ERR_EXIST_EMAIL = "이메일 중복 확인을 해주세요.";
const LABEL_NAME = "이름";
const LABEL_IMAGE = "사진";
const LABEL_EMAIL = "이메일";
const LABEL_PHONE = "연락처";
const LABEL_PASSWORD = "비밀번호";
const LABEL_PASSWORD_RE = "비밀번호 확인";
const LABEL_AGE = "생년월일";
const LABEL_ADDRESS = "주소";
const LABEL_EMAIL_CHECK = "중복 확인";
const LABEL_CANCEL = "취소";
const LABEL_JOIN = "가입";

interface Valid {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_re: string;
}

const Join = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState<Account>({
    name: "",
    image: "",
    email: "",
    phone: "",
    age: "",
    address: "",
    time: 0,
    password: "",
    password_re: "",
  });

  const [valid, setValid] = useState<Valid>({
    name: MSG_ERR_DISABLE,
    email: MSG_ERR_DISABLE,
    phone: MSG_ERR_DISABLE,
    password: MSG_ERR_UNCHECKED,
    password_re: MSG_ERR_UNCHECKED,
  });

  const PAPER_STYLE = {
    margin: 1,
    padding: 3,
    textAlign: "left",
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;
    if (account && valid) {
      switch (id) {
        case ID_NAME:
          account.name = value;
          break;
        case ID_EMAIL:
          account.email = value;
          if (valid.email === MSG_ERR_ENABLE) {
            valid.email = MSG_ERR_DISABLE;
          }
          break;
        case ID_PHONE:
          account.phone = value;
          if (valid.phone === MSG_ERR_ENABLE) {
            valid.phone = MSG_ERR_DISABLE;
          }
          break;
        case ID_AGE:
          account.age = value;
          break;
        case ID_ADDRESS:
          account.address = value;
          break;
        case ID_PASSWORD:
          account.password = value;
          break;
        case ID_PASSWORD_RE:
          account.password_re = value;
          break;
        default:
          break;
      }
      setValid({ ...valid });
      setAccount({ ...account });
    }
  };

  const emailCheck = async () => {
    if (account && valid) {
      const exist = await emailExistCheck(account.email);
      if (exist) {
        valid.email = MSG_ERR_DISABLE;
        alert(MSG_EMAIL_DISABLE);
      } else {
        valid.email = MSG_ERR_ENABLE;
        alert(MSG_EMAIL_ENABLE);
      }
      setValid({ ...valid });
    }
  };

  const onJoinClick = async () => {
    if (!account.name) {
      alert(MSG_ERR_EMPTY_NAME);
      return;
    } else if (!account.email) {
      alert(MSG_ERR_EMPTY_EMAIL);
      return;
    } else if (!account.phone) {
      alert(MSG_ERR_EMPTY_PHONE);
      return;
    } else if (!account.password || !account.password_re) {
      alert(MSG_ERR_EMPTY_PASSWORD);
      return;
    } else if (account.password !== account.password_re) {
      alert(MSG_ERR_EMPTY_PASSWORD2);
      return;
    }

    if (valid.email === MSG_ERR_DISABLE) {
      alert(MSG_ERR_EXIST_EMAIL);
      return;
    }
    const result = await addAccount(account);
    if (result) {
      alert(MSG_JOIN_COMPLETED);
    } else {
      alert(MSG_JOIN_FAILED);
    }
    navigate(ROUTE_LOGIN);
  };

  const NAME_ITEM = (
    <Grid item xs={6}>
      <Paper sx={PAPER_STYLE}>
        <Typography>{LABEL_NAME}</Typography>
        <TextField sx={{ width: "50%" }} id={ID_NAME} type="text" value={account?.name} onChange={onChange} />
        {account?.name ? <></> : <Typography>{MSG_ERR_EMPTY}</Typography>}
      </Paper>
    </Grid>
  );
  const IMAGE_ITEM = (
    <Grid item xs={6}>
      <Paper sx={PAPER_STYLE}>
        <Typography>{LABEL_IMAGE}</Typography>
        <input type="file"></input>
      </Paper>
    </Grid>
  );
  const EMAIL_ITEM = (
    <Grid item xs={6}>
      <Paper sx={PAPER_STYLE}>
        <Typography>{LABEL_EMAIL}</Typography>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "left" }}>
          <TextField
            sx={{ width: "50%", marginRight: 1 }}
            id={ID_EMAIL}
            type="email"
            value={account?.email}
            onChange={onChange}
          />
          <Button variant="contained" onClick={emailCheck}>
            {LABEL_EMAIL_CHECK}
          </Button>
        </div>
        {account?.email ? <Typography>{valid?.email}</Typography> : <Typography>{MSG_ERR_EMPTY}</Typography>}
      </Paper>
    </Grid>
  );
  const PHONE_ITEM = (
    <Grid item xs={6}>
      <Paper sx={PAPER_STYLE}>
        <Typography>{LABEL_PHONE}</Typography>
        <TextField sx={{ width: "50%" }} id={ID_PHONE} type="tel" value={account?.phone} onChange={onChange} />
        {/* <Button variant="contained">인증</Button> */}
        {account?.phone ? <></> : <Typography>{MSG_ERR_EMPTY}</Typography>}
      </Paper>
    </Grid>
  );

  const PASSWORD_ITEM = (
    <Grid item xs={6}>
      <Paper sx={PAPER_STYLE}>
        <Typography>{LABEL_PASSWORD}</Typography>
        <TextField
          sx={{ width: "50%" }}
          id={ID_PASSWORD}
          type="password"
          value={account?.password}
          onChange={onChange}
        />
      </Paper>
    </Grid>
  );

  const PASSWORD_RE_ITEM = (
    <Grid item xs={6}>
      <Paper sx={PAPER_STYLE}>
        <Typography>{LABEL_PASSWORD_RE}</Typography>
        <TextField
          sx={{ width: "50%" }}
          id={ID_PASSWORD_RE}
          type="password"
          value={account?.password_re}
          onChange={onChange}
        />
      </Paper>
    </Grid>
  );
  const AGE_ITEM = (
    <Grid item xs={4}>
      <Paper sx={PAPER_STYLE}>
        <Typography>{LABEL_AGE}</Typography>
        <TextField sx={{ width: "50%" }} id={ID_AGE} type="text" value={account?.age} onChange={onChange} />
      </Paper>
    </Grid>
  );

  const ADDRESS_ITEM = (
    <Grid item xs={8}>
      <Paper sx={PAPER_STYLE}>
        <Typography>{LABEL_ADDRESS}</Typography>
        <TextField sx={{ width: "100%" }} id={ID_ADDRESS} type="text" value={account?.address} onChange={onChange} />
      </Paper>
    </Grid>
  );
  return (
    <>
      <div>
        <Box sx={{ width: "100%" }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {NAME_ITEM}
            {IMAGE_ITEM}
            {EMAIL_ITEM}
            {PHONE_ITEM}
            {PASSWORD_ITEM}
            {PASSWORD_RE_ITEM}
            {AGE_ITEM}
            {ADDRESS_ITEM}
          </Grid>
          <Box display="flex" justifyContent="end" alignItems="end">
            <Button onClick={() => navigate(ROUTE_LOGIN)}>{LABEL_CANCEL}</Button>
            <Button onClick={onJoinClick}>{LABEL_JOIN}</Button>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Join;
