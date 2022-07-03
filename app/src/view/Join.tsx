import { Button, CircularProgress, TextField } from "@mui/material";
import { Paper } from "@mui/material";
import { Box, Container } from "@mui/system";
import { ROUTE_LOGIN } from "common/Constant";
import { ChangeEvent, useState } from "react";
import { addAccount, emailExistCheck } from "api/FirebaseApi";
import { useNavigate } from "react-router-dom";
import { Account } from "interface/Account";
import { useRef } from "react";
import { LocalFile } from "interface/LocalFile";
import { styled } from "@material-ui/styles";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Label, { LABEL_SIZE_ERROR, LABEL_SIZE_SMALL } from "component/Labels";
import GlobalTab from "./GlobalTab";
const IMAGE_SIZE_WIDTH = 400;
const IMAGE_SIZE_HEIGHT = 400;

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
const MSG_ERR_PASSWORD_LENGTH = "비밀번호는 6자이상이어야 합니다.";
const MSG_ERR_EMPTY_PASSWORD = "비밀번호를 입력하세요.";
const MSG_ERR_EMPTY_PASSWORD2 = "비밀번호가 일치하지 않습니다.";
const MSG_ERR_EXIST_EMAIL = "이메일 중복 확인을 해주세요.";
const LABEL_NAME = "이름";
const LABEL_IMAGE = `사진(${IMAGE_SIZE_WIDTH}X${IMAGE_SIZE_HEIGHT})`;
const LABEL_EMAIL = "이메일";
const LABEL_PHONE = "연락처";
const LABEL_PASSWORD = "비밀번호(6자이상)";
const LABEL_PASSWORD_RE = "비밀번호 확인";
const LABEL_AGE = "생년월일";
const LABEL_ADDRESS = "주소";
const LABEL_EMAIL_CHECK = "중복 확인";
const LABEL_CANCEL = "취소";
const LABEL_JOIN = "가입";
const DEFAULT_FIELD_WIDTH = 400;

interface Valid {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_re: string;
}

const FieldWrapper = styled(Paper)({
  margin: 10,
  padding: 50,
  minWidth: 500,
  textAlign: "center",
});

const Join = () => {
  const navigate = useNavigate();
  const fileRef = useRef<any>(null);
  const [account, setAccount] = useState<Account>({
    id: "",
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

  const [localFile, setLocalFile] = useState<LocalFile>({
    name: null,
    path: null,
    file: null,
  });

  const [updating, setUpdating] = useState(false);

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
    setUpdating(true);
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
    setUpdating(false);
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
    } else if (account.password.length < 6) {
      alert(MSG_ERR_PASSWORD_LENGTH);
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
    setUpdating(true);
    const result = await addAccount(account, localFile);
    if (result) {
      alert(MSG_JOIN_COMPLETED);
    } else {
      alert(MSG_JOIN_FAILED);
    }
    setUpdating(false);
    navigate(ROUTE_LOGIN);
  };

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e?.target;
    if (!input.files?.length) {
      return;
    }

    const file_object = input.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      localFile.name = file_object.name;
      localFile.file = file_object;
      localFile.path = reader.result;
      setLocalFile({ ...localFile });
    };

    reader.readAsDataURL(file_object);
  };

  const onDateChange = (e: Date | null) => {
    if (e) {
      const year = e.getFullYear();
      const month = e.getMonth() + 1;
      let month_text: string = month.toString();
      if (month < 10) {
        month_text = "0" + month_text;
      }
      let date = e.getDate();
      let date_text: string = date.toString();
      if (date < 10) {
        date_text = "0" + date_text;
      }
      account.age = year + "/" + month_text + "/" + date_text;
      setAccount({ ...account });
    }
  };

  const onImageResetClick = () => {
    localFile.name = null;
    localFile.file = null;
    localFile.path = "";
    fileRef.current.value = null;
    setLocalFile({ ...localFile });
  };

  const getCommonField = (label: string, id: string, width: number, value: string) => {
    return (
      <FieldWrapper>
        <Label label={label} size={LABEL_SIZE_SMALL} />
        <TextField sx={{ width: width }} id={id} type="text" value={value} onChange={onChange} />
        {account?.name ? <></> : <Label label={MSG_ERR_EMPTY} size={LABEL_SIZE_ERROR} />}
      </FieldWrapper>
    );
  };

  const getImageField = () => {
    return (
      <FieldWrapper>
        <Label label={LABEL_IMAGE} size={LABEL_SIZE_SMALL} />
        <input ref={fileRef} type="file" accept="image/" onChange={onImageChange} />
        {localFile.path ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src={localFile.path} width={IMAGE_SIZE_WIDTH} height={IMAGE_SIZE_HEIGHT} alt="logo" />
              <Button variant="contained" onClick={onImageResetClick}>
                초기화
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
      </FieldWrapper>
    );
  };
  const getEmailField = () => {
    return (
      <FieldWrapper>
        <Label label={LABEL_EMAIL} size={LABEL_SIZE_SMALL} />
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <TextField
            sx={{ width: DEFAULT_FIELD_WIDTH, marginRight: 1 }}
            id={ID_EMAIL}
            type="email"
            value={account?.email}
            onChange={onChange}
          />
          <Button variant="contained" onClick={emailCheck}>
            {LABEL_EMAIL_CHECK}
          </Button>
        </div>
        {account?.email ? (
          <Label label={valid?.email} size={LABEL_SIZE_ERROR} />
        ) : (
          <Label label={MSG_ERR_EMPTY} size={LABEL_SIZE_ERROR} />
        )}
      </FieldWrapper>
    );
  };
  const getPasswordField = (label: string, id: string, width: number, value: string) => {
    return (
      <FieldWrapper>
        <Label label={label} size={LABEL_SIZE_SMALL} />
        <TextField sx={{ width: width }} id={id} type="password" value={value} onChange={onChange} />
      </FieldWrapper>
    );
  };

  const getAgeField = () => {
    return (
      <FieldWrapper>
        <Label label={LABEL_AGE} size={LABEL_SIZE_SMALL} />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label={LABEL_AGE}
            inputFormat="yyyy//MM/dd"
            value={account.age}
            onChange={onDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </FieldWrapper>
    );
  };
  const NAME_FIELD = getCommonField(LABEL_NAME, ID_NAME, DEFAULT_FIELD_WIDTH, account?.name);
  const IMAGE_FIELD = getImageField();
  const EMAIL_FIELD = getEmailField();
  const PHONE_FIELD = getCommonField(LABEL_PHONE, ID_PHONE, DEFAULT_FIELD_WIDTH, account?.phone);
  const PASSWORD_FIELD = getPasswordField(LABEL_PASSWORD, ID_PASSWORD, DEFAULT_FIELD_WIDTH, account?.password);
  const PASSWORD_RE_FIELD = getPasswordField(
    LABEL_PASSWORD_RE,
    ID_PASSWORD_RE,
    DEFAULT_FIELD_WIDTH,
    account?.password_re
  );

  const AGE_FIELD = getAgeField();
  const ADDRESS_FIELD = getCommonField(LABEL_ADDRESS, ID_ADDRESS, DEFAULT_FIELD_WIDTH, account?.address);

  if (updating) {
    return (
      <Box sx={{ width: "100wh", height: "100vh" }} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <GlobalTab />
      <Container fixed>
        <Box>
          {NAME_FIELD}
          {IMAGE_FIELD}
          {EMAIL_FIELD}
          {PHONE_FIELD}
          {PASSWORD_FIELD}
          {PASSWORD_RE_FIELD}
          {AGE_FIELD}
          {ADDRESS_FIELD}
        </Box>
        <Box display="flex" justifyContent="end">
          <Button sx={{ m: 1 }} variant="contained" onClick={() => navigate(ROUTE_LOGIN)}>
            {LABEL_CANCEL}
          </Button>
          <Button sx={{ m: 1 }} variant="contained" onClick={onJoinClick}>
            {LABEL_JOIN}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Join;
