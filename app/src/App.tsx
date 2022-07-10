import {
  ROUTE_ACCOUNT,
  ROUTE_ACCOUNT_EDIT,
  ROUTE_DASHBOARD,
  ROUTE_DEBUG,
  ROUTE_ID,
  ROUTE_JOIN,
  ROUTE_LOGIN,
  ROUTE_MEMBER,
  ROUTE_NOTICE,
} from "common/Constant";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AccountListView from "view/account/AccountListView";
import Dashboard from "view/dashboard/Dashboard";
import DebugView from "debug/DebugView";
import Join from "view/join/JoinView";
import Login from "view/login/LoginView";
import Member from "view/member/Member";
import Notice from "view/notice/Notice";
import AccountEditView from "view/account/AccountEditView";
import { functions } from "config/FirebaseConfig";
import { connectFunctionsEmulator } from "firebase/functions";

const App = () => {
  // emulator 실행시 
  // connectFunctionsEmulator(functions, "localhost", 5001);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTE_LOGIN} element={<Login />} />
          <Route path={ROUTE_JOIN + ROUTE_ID} element={<Join />} />
          <Route path={ROUTE_DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTE_MEMBER} element={<Member />} />
          <Route path={ROUTE_NOTICE} element={<Notice />} />
          <Route path={ROUTE_ACCOUNT} element={<AccountListView />} />
          <Route path={ROUTE_ACCOUNT_EDIT + ROUTE_ID} element={<AccountEditView />} />
          <Route path={ROUTE_DEBUG} element={<DebugView />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
