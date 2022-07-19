import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import { useState } from "react";
import { TextField } from "@material-ui/core";
import { auth } from "config/FirebaseConfig";
import { getLogoImageComponent, MARGIN_DEFAULT, ROUTE_DASHBOARD, ROUTE_JOIN, ROUTE_LOGIN } from "common/Constant";
import { resetPassword } from "api/FirebaseApi";
import Loading from "component/Loading";

const LABEL_LOG_IN = "로그인";
const LABEL_PASSWORD_RESET = "비밀번호 초기화";
const LABEL_JOIN = "계정생성";
const MSG_LOGIN_FAILED = "로그인 실패하였습니다.";
const MSG_INPUT_EMAIL = "비밀번호를 초기화할 이메일을 입력하세요.";
const MSG_PASSWORD_RESET = "비밀번호가 초기화 되었습니다. 해당 메일에서 확인하세요.";
const ID_EMAIL = "email";
const ID_PASSWORD = "password";

const LoginView = () => {
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

  const goPage = useCallback(
    (path: string): void => {
      navigate(path);
    },
    [navigate]
  );

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
        alert(MSG_LOGIN_FAILED);
      });
  };

  const onJoinClick = () => {
    goPage(ROUTE_JOIN + "/-1");
  };

  if (updating) {
    return <Loading />;
  }

  const onPasswordResetClick = async () => {
    const email = window.prompt(MSG_INPUT_EMAIL);
    if (email) {
      const res = await resetPassword(email);
      console.log(`res`, res);
      alert(MSG_PASSWORD_RESET);
    }
  };
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
          <></>
        ) : (
          <Button style={{ margin: MARGIN_DEFAULT }} onClick={onLoginClick}>
            {LABEL_LOG_IN}
          </Button>
        )}
        <Button style={{ margin: MARGIN_DEFAULT }} onClick={onJoinClick}>
          {LABEL_JOIN}
        </Button>
        <Button style={{ margin: MARGIN_DEFAULT }} onClick={onPasswordResetClick}>
          {LABEL_PASSWORD_RESET}
        </Button>
      </div>
    </>
  );
};

export default LoginView;
