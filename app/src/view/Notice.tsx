import GlobalTab from "./GlobalTab";
import NoticeListArea from "../component/notice/NoticeListArea"
import NoticeRegistArea from "../component/notice/NoticeRegistArea"

const Notice = () => {
  return (
    <>
      <GlobalTab />
      Notice
        <NoticeListArea/>
        <NoticeRegistArea/>
    </>
  );
};

export default Notice;
