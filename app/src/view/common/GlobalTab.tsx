/* eslint-disable */
import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import {
  DEFAULT_PROFILE_IMAGE,
  getLogoImageComponent,
  ROUTE_ACCOUNT,
  ROUTE_DASHBOARD,
  ROUTE_JOIN,
  ROUTE_LOGIN,
  ROUTE_MEMBER,
  ROUTE_NOTICE,
} from "common/Constant";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "config/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import AccountDataHook from "api/AccountDataHook";

const ID_JOIN = "join";
const ID_DASHBOARD = "dashboard";
const ID_MEMBER = "member";
const ID_NOTICE = "notice";
const ID_ACCOUNT = "account";
const SELECTED_TAB_COLOR = "#D9EDFF";
const DEFAULT_TAB_COLOR = "#FFFFFF";
const MESSAGE_LOGOUT = "로그아웃하였습니다.";
const GlobalTab = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const url = window.location.href;

  const { account } = AccountDataHook();
  const [tabColor, setTabColor] = useState([
    DEFAULT_TAB_COLOR,
    DEFAULT_TAB_COLOR,
    DEFAULT_TAB_COLOR,
    DEFAULT_TAB_COLOR,
    DEFAULT_TAB_COLOR,
  ]);

  const onClick = (e: any) => {
    const id = e.target.id;
    switch (id) {
      case ID_JOIN:
        goPage(ROUTE_JOIN);
        break;
      case ID_DASHBOARD:
        goPage(ROUTE_DASHBOARD);
        break;
      case ID_MEMBER:
        goPage(ROUTE_MEMBER);
        break;
      case ID_NOTICE:
        goPage(ROUTE_NOTICE);
        break;
      case ID_ACCOUNT:
        goPage(ROUTE_ACCOUNT);
        break;
      default:
        break;
    }
  };
  const checkTabFocus = useCallback(() => {
    for (let i = 0; i < tabColor.length; i++) {
      tabColor[i] = DEFAULT_TAB_COLOR;
    }
    if (url.includes(ROUTE_DASHBOARD)) {
      tabColor[0] = SELECTED_TAB_COLOR;
    } else if (url.includes(ROUTE_MEMBER)) {
      tabColor[1] = SELECTED_TAB_COLOR;
    } else if (url.includes(ROUTE_NOTICE)) {
      tabColor[2] = SELECTED_TAB_COLOR;
    } else if (url.includes(ROUTE_ACCOUNT)) {
      tabColor[3] = SELECTED_TAB_COLOR;
    } else if (url.includes(ROUTE_JOIN)) {
      tabColor[4] = SELECTED_TAB_COLOR;
    }
    setTabColor({ ...tabColor });
  }, [tabColor, url]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
    checkTabFocus();
  }, [auth]);

  const goPage = (path: string): void => {
    navigate(path);
  };

  const onLogoutClick = () => {
    signOut(auth).then(() => {
      setUser(undefined);
      alert(MESSAGE_LOGOUT);
      goPage(ROUTE_LOGIN);
    });
  };

  const onAccountEditClick = () => {
    if (account) {
      goPage(ROUTE_JOIN + `/${account.id}`);
    }
  };

  const imgPath = account && account.image ? account.image : DEFAULT_PROFILE_IMAGE;
  return (
    <>
      <Box sx={{ p: 2, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", height: 150 }}>
        {getLogoImageComponent(ROUTE_LOGIN, goPage)}
        {user ? (
          <>
            <Button id={ID_DASHBOARD} onClick={onClick} sx={{ height: 100, backgroundColor: tabColor[0] }}>
              대시보드
            </Button>
            <Button id={ID_MEMBER} onClick={onClick} sx={{ height: 100, backgroundColor: tabColor[1] }}>
              회원관리
            </Button>
            <Button id={ID_NOTICE} onClick={onClick} sx={{ height: 100, backgroundColor: tabColor[2] }}>
              공지사항
            </Button>
            <Button id={ID_ACCOUNT} onClick={onClick} sx={{ height: 100, backgroundColor: tabColor[3] }}>
              계정관리
            </Button>
            {account && (
              <Box sx={{ mr: 5, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", height: 100, width: 300 }}>
                <Box sx={{ p: 1, display: "grid", gridTemplateColumns: "repeat(1, 1fr)", height: 100 }}>
                  <img width="80" height="80" src={imgPath} alt="profile"></img>
                </Box>

                <Box sx={{ p: 1, display: "grid", gridTemplateColumns: "repeat(1, 2fr)", height: 100 }}>
                  <Typography sx={{ height: 20, width: 100 }} variant="subtitle2">
                    {account.name}
                  </Typography>
                  <Typography sx={{ height: 20, width: 100 }} variant="subtitle2">
                    {account.email}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, display: "grid", gridTemplateColumns: "repeat(1, 2fr)", height: 100 }}>
                  <Button sx={{ height: 20, width: 100 }} onClick={onAccountEditClick}>
                    수정
                  </Button>
                  <Button sx={{ height: 20, width: 100 }} onClick={onLogoutClick}>
                    로그아웃
                  </Button>
                </Box>
              </Box>
            )}
          </>
        ) : (
          <Button id={ID_JOIN} onClick={onClick} sx={{ height: 100, backgroundColor: tabColor[4] }}>
            회원가입
          </Button>
        )}
      </Box>
    </>
  );
};

export default GlobalTab;
