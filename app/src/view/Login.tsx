import React from "react";
import { Button } from "@mui/material";
import { signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { useState } from "react";
import { TextField } from "@material-ui/core";
import { addLoginData, addLoginFailtData, addLogoutData } from "../api/FirebaseApi";
import { auth } from "config/FirebaseConfig";
import { MARGIN_DEFAULT } from "common/Constant";

const LABEL_LOG_IN = "로그인";
const LABEL_LOG_OUT = "로그아웃";
const LABEL_JOIN = "계정생성";
const MESSAGE_LOGIN_FAILED = "로그인 실패";
const MESSAGE_LOGOUT = "로그아웃 성공";
const ID_EMAIL = "email";
const ID_PASSWORD = "password";

const Login = () => {
  const [user, setUser] = useState<User>();

  const WRAPPER_STYLE: React.CSSProperties | undefined = {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onLoginClick = () => {
    console.log(`onLoginClick email=${email} password=${password}`);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          setUser(user);
          addLoginData();
        }
      })
      .catch((error) => {
        addLoginFailtData();
        console.log(`error ${error}`);
        alert(MESSAGE_LOGIN_FAILED);
      });
  };

  const onLogOutClick = () => {
    signOut(auth).then(() => {
      setUser(undefined);
      addLogoutData();
      alert(MESSAGE_LOGOUT);
    });
  };

  const onJoinClick = () => {};

  return (
    <>
      <div style={WRAPPER_STYLE}>
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
