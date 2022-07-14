import GlobalTab from "view/common/GlobalTab";
import MapArea from "component/member/MapArea";
import MemberInfoArea from "component/member/MemberInfoArea";
import MemberDetailArea from "component/member/MemberDetailArea";

const Member = () => {
  return (
    <>
      <GlobalTab />
      {/* 대략적인 파일만 */}
      <MemberInfoArea></MemberInfoArea>
      <MapArea></MapArea>
      <MemberDetailArea></MemberDetailArea>
    </>
  );
};

export default Member;
