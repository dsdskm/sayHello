import { CircularProgress } from "@material-ui/core";
import { Button, TextField, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { Account } from "interface/Account";
import { useState } from "react";
import AccountView from "view/AccountView";
import GlobalTab from "../view/GlobalTab";
import { getRandomName } from "./DebugUtils";
import { addAccountList, deleteDebugAccount } from "./FirebaseDebugApi";

const DebugAccount = () => {
  const [count, setCount] = useState<number>(1);
  const [updating, setUpdating] = useState<Boolean>(false);
  const onGenerateClick = async () => {
    if (window.confirm(`${count}개 생성`)) {
      setUpdating(true);
      const time = new Date().getTime();
      const list = [];
      for (let i = 1; i <= count; i++) {
        const account: Account = {
          id: (time + i).toString(),
          name: getRandomName(),
          image:
            "https://firebasestorage.googleapis.com/v0/b/sayhello-8de64.appspot.com/o/images%2Fsample%2Fpeople.jpeg?alt=media&token=f52effdb-7da7-4549-8b7e-6d963a418992",
          email: `tothetg${i}@naver.com`,
          phone: "010-1234-5678",
          age: "1988/01/01",
          address: "서울시 강서구 마곡동 123-456",
          time: time + i,
          password: "123456",
          password_re: "123456",
        };
        list.push(account);
      }
      await addAccountList(list);
      alert("추가 완료");
      setUpdating(false);
    }
  };

  const onClickAllClick = async () => {
    if (window.confirm(`debug 계정 삭제`)) {
      setUpdating(true);
      await deleteDebugAccount();
      alert("Debug계정 삭제 완료");
      setUpdating(false);
    }
  };
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
      <Container>
        <Box sx={{ p: 2, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", alignItems: "center" }}>
          <Typography>Account</Typography>
          <TextField type="number" value={count} onChange={(e) => setCount(+e.target.value)}></TextField>
          <Button onClick={onGenerateClick}>Generate</Button>
          <Button onClick={onClickAllClick}>Clear All</Button>
        </Box>
      </Container>
    </>
  );
};

export default DebugAccount;
