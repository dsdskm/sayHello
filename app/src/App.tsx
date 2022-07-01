import { ROUTE_JOIN, ROUTE_LOGIN } from "common/Constant";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Join from "view/Join";
import Login from "view/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_LOGIN} element={<Login />} />
        <Route path={ROUTE_JOIN} element={<Join />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
