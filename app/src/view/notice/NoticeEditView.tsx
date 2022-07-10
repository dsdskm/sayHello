import CustomLabel, { LABEL_SIZE_SMALL } from "component/Labels";
import GlobalTab from "view/common/GlobalTab";
import { styled } from "@material-ui/styles";
import { Button, Paper, TextField } from "@mui/material";
import NoticeDataHook from "api/NoticeDataHook";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DEFAULT_NOTICE_DATA, Notice } from "interface/Notice";
import FieldContentWrapper from "component/FieldContentWrapper";
import FieldContentBottomWrapper from "component/FieldContentBottomWrapper";
import { ROUTE_NOTICE } from "common/Constant";
import Loading from "component/Loading";
import { addNotice, deleteNotice } from "api/FirebaseApi";
import { getStorage, KEY_ACCOUNT } from "common/Utils";

const ID_NUM = "id";
const ID_TITLE = "title";
const ID_CONTENTS = "contents";
const ID_WRITER = "writer";
const LABEL_ID = "ID";
const LABEL_TITLE = "제목";
const LABEL_CONTENTS = "내용";
const LABEL_WRITER = "작성자";
const LABEL_ADD = "추가";
const LABEL_UPDATE = "수정";
const LABEL_DELETE = "삭제";
const LABEL_CANCEL = "취소";

const MSG_ERR_TITLE = "제목을 입력하세요.";
const MSG_ERR_CONTENTS = "내용을 입력하세요";
const MSG_COMPLETED = "완료되었습니다.";
const MSG_DELETED = "삭제되었습니다.";
const DEFAULT_FIELD_WIDTH = 400;

const FieldWrapper = styled(Paper)({
  margin: 10,
  padding: 50,
  minWidth: 500,
  textAlign: "center",
});

const NoticeEditView = () => {
  const { noticeList } = NoticeDataHook();
  const params = useParams();
  const id = params.id;
  const isAdd = id === "-1";
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice>(DEFAULT_NOTICE_DATA);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAdd) {
      const data = noticeList?.filter((data) => {
        return data.id === id;
      });
      if (data) {
        setNotice(data[0]);
      }
    }
  }, [noticeList, isAdd, id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;
    if (notice) {
      switch (id) {
        case ID_TITLE:
          notice.title = value;
          break;
        case ID_CONTENTS:
          notice.contents = value;
          break;
        default:
          break;
      }
      setNotice({ ...notice });
    }
  };

  const onDeleteClick = async () => {
    setUpdating(true);
    await deleteNotice(notice);
    alert(MSG_DELETED);
    setUpdating(false);
    navigate(ROUTE_NOTICE);
  };

  const onAddClick = async () => {
    notice.writer = getStorage(KEY_ACCOUNT);
    if (!notice.title) {
      alert(MSG_ERR_TITLE);
      return;
    } else if (!notice.contents) {
      alert(MSG_ERR_CONTENTS);
      return;
    }
    setUpdating(true);
    await addNotice(notice, isAdd);
    alert(MSG_COMPLETED);
    setUpdating(false);
    navigate(ROUTE_NOTICE);
  };

  const getCommonField = (label: string, id: string, width: number, value: string) => {
    return (
      <FieldWrapper>
        <CustomLabel label={label} size={LABEL_SIZE_SMALL} />
        <TextField autoComplete="off" sx={{ width: width }} id={id} type="text" value={value} onChange={onChange} />
      </FieldWrapper>
    );
  };

  const getContentsField = (label: string, id: string, width: number, value: string) => {
    return (
      <FieldWrapper>
        <CustomLabel label={label} size={LABEL_SIZE_SMALL} />
        <TextField
          autoComplete="off"
          sx={{ width: width }}
          id={id}
          type="text"
          value={value}
          multiline
          maxRows={10}
          onChange={onChange}
        />
      </FieldWrapper>
    );
  };

  const ID_FIELD = getCommonField(LABEL_ID, ID_NUM, DEFAULT_FIELD_WIDTH, notice.id);
  const TITLE_FIELD = getCommonField(LABEL_TITLE, ID_TITLE, DEFAULT_FIELD_WIDTH, notice.title);
  const CONTENTS_FIELD = getContentsField(LABEL_CONTENTS, ID_CONTENTS, DEFAULT_FIELD_WIDTH, notice.contents);
  const WRITER_FIELD = getCommonField(LABEL_WRITER, ID_WRITER, DEFAULT_FIELD_WIDTH, notice.writer);

  if (updating) {
    return <Loading />;
  }

  return (
    <>
      <GlobalTab />
      <FieldContentWrapper>
        {isAdd ? <></> : ID_FIELD}
        {TITLE_FIELD}
        {CONTENTS_FIELD}
        {isAdd ? <></> : WRITER_FIELD}
      </FieldContentWrapper>
      <FieldContentBottomWrapper>
        <Button sx={{ m: 1 }} variant="contained" onClick={() => navigate(ROUTE_NOTICE)}>
          {LABEL_CANCEL}
        </Button>
        {isAdd ? (
          <></>
        ) : (
          <Button sx={{ m: 1 }} variant="contained" onClick={onDeleteClick}>
            {LABEL_DELETE}
          </Button>
        )}
        <Button sx={{ m: 1 }} variant="contained" onClick={onAddClick}>
          {isAdd ? LABEL_ADD : LABEL_UPDATE}
        </Button>
      </FieldContentBottomWrapper>
    </>
  );
};

export default NoticeEditView;
