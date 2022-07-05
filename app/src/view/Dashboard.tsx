import GlobalTab from "./GlobalTab";
import LeftAlertArea from "../component/dashboard/LeftAlertArea";
import RightListArea from "../component/dashboard/RightListArea";

const Dashboard = () => {
  return (
    <>
      <GlobalTab />
        {/* 부트스트랩 col-md-3과 같이, mui에서도 영역 나누는 class등을 찾아서 변경 예정*/}
        <div col-md-3>
            <LeftAlertArea></LeftAlertArea>
        </div>
        <div col-md-9>
            <RightListArea></RightListArea>
        </div>
        DashBoard
    </>
  );
};

export default Dashboard;
