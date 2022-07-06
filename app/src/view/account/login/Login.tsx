import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { useState } from "react";
import { TextField } from "@material-ui/core";
import { auth } from "config/FirebaseConfig";
import {
  getLogoImageComponent,
  MARGIN_DEFAULT,
  MESSAGE_LOGOUT,
  ROUTE_DASHBOARD,
  ROUTE_JOIN,
  ROUTE_LOGIN,
} from "common/Constant";
import { Box } from "@mui/system";
import { CircularProgress } from "@material-ui/core";

const LABEL_LOG_IN = "로그인";
const LABEL_LOG_OUT = "로그아웃";
const LABEL_JOIN = "계정생성";
const MESSAGE_LOGIN_FAILED = "로그인 실패하였습니다.";
const ID_EMAIL = "email";
const ID_PASSWORD = "password";

const Login = () => {
  const [user, setUser] = useState<User>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();
  const WRAPPER_STYLE: React.CSSProperties | undefined = {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const goPage = useCallback((path: string): void => {
    navigate(path);
  }, [navigate]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        goPage(ROUTE_DASHBOARD);
      }
    });
  }, [goPage]);

  const onLoginClick = () => {
    setUpdating(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          setUser(user);
          setUpdating(false);
        }
      })
      .catch((error) => {
        console.log(`error ${error}`);
        setUpdating(false);
        alert(MESSAGE_LOGIN_FAILED);
      });
  };

  const onLogOutClick = () => {
    signOut(auth).then(() => {
      setUser(undefined);
      alert(MESSAGE_LOGOUT);
      goPage(ROUTE_LOGIN);
    });
  };

  const onJoinClick = () => {
    goPage(ROUTE_JOIN);
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
      <div style={WRAPPER_STYLE}>
        {getLogoImageComponent(ROUTE_LOGIN, goPage)}
        <TextField
          style={{ margin: MARGIN_DEFAULT }}
          id={ID_EMAIL}
          type="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          style={{ margin: MARGIN_DEFAULT }}
          id={ID_PASSWORD}
          type="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {user ? (
          <Button style={{ margin: MARGIN_DEFAULT }} onClick={onLogOutClick}>
            {LABEL_LOG_OUT}
          </Button>
        ) : (
          <Button style={{ margin: MARGIN_DEFAULT }} onClick={onLoginClick}>
            {LABEL_LOG_IN}
          </Button>
        )}
        <Button style={{ margin: MARGIN_DEFAULT }} onClick={onJoinClick}>
          {LABEL_JOIN}
        </Button>
      </div>
    </>
  );
};

export default Login;
