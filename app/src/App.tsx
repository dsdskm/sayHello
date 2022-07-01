import { BrowserRouter, Route, Routes } from "react-router-dom";
import Join from "view/Join";
import Login from "view/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/join" element={<Join />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
