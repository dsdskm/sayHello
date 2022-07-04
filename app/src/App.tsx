import {
  ROUTE_ACCOUNT,
  ROUTE_DASHBOARD,
  ROUTE_DEBUG_ACCOUNT,
  ROUTE_JOIN,
  ROUTE_LOGIN,
  ROUTE_MEMBER,
  ROUTE_NOTICE,
} from "common/Constant";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AccountView from "view/AccountView";
import Dashboard from "view/Dashboard";
import DebugAccount from "debug/DebugAccount";
import Join from "view/Join";
import Login from "view/Login";
import Member from "view/Member";
import Notice from "view/Notice";

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
          <Route path={ROUTE_DEBUG_ACCOUNT} element={<DebugAccount />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
