import {
  ROUTE_ACCOUNT,
  ROUTE_DASHBOARD,
  ROUTE_DEBUG,
  ROUTE_JOIN,
  ROUTE_LOGIN,
  ROUTE_MEMBER,
  ROUTE_NOTICE,
} from "common/Constant";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AccountView from "view/account/AccountView";
import Dashboard from "view/dashboard/Dashboard";
import DebugView from "debug/DebugView";
import Join from "view/join/Join";
import Login from "view/login/Login";
import Member from "view/member/Member";
import Notice from "view/notice/Notice";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTE_LOGIN} element={<Login />} />
          <Route path={ROUTE_JOIN} element={<Join />} />
          <Route path={ROUTE_DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTE_MEMBER} element={<Member />} />
          <Route path={ROUTE_NOTICE} element={<Notice />} />
          <Route path={ROUTE_ACCOUNT} element={<AccountView />} />
          <Route path={ROUTE_DEBUG} element={<DebugView />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
