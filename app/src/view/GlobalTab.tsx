import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import {
  getLogoImageComponent,
  LOGO_IMAGE_COMPONENT,
  ROUTE_ACCOUNT,
  ROUTE_DASHBOARD,
  ROUTE_JOIN,
  ROUTE_LOGIN,
  ROUTE_MEMBER,
  ROUTE_NOTICE,
} from "common/Constant";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "config/FirebaseConfig";
import { useNavigate } from "react-router-dom";

const ID_JOIN = "join";
const ID_DASHBOARD = "dashboard";
const ID_MEMBER = "member";
const ID_NOTICE = "notice";
const ID_ACCOUNT = "account";
const GlobalTab = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const url = window.location.href;
  console.log(`url ${url}`);
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
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  const goPage = (path: string): void => {
    navigate(path);
  };

  return (
    <>
      <Box sx={{ p: 2, display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {getLogoImageComponent(ROUTE_LOGIN, goPage)}
        {user ? (
          <>
            <Button id={ID_DASHBOARD} onClick={onClick}>
              대시보드
            </Button>
            <Button id={ID_MEMBER} onClick={onClick}>
              회원관리
            </Button>
            <Button id={ID_NOTICE} onClick={onClick}>
              공지사항
            </Button>
            <Button id={ID_ACCOUNT} onClick={onClick}>
              계정관리
            </Button>
          </>
        ) : (
          <Button id={ID_JOIN} onClick={onClick}>
            회원가입
          </Button>
        )}
      </Box>
    </>
  );
};

export default GlobalTab;
