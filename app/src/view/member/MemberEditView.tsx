import CustomLabel, { LABEL_SIZE_SMALL } from "component/Labels";
import GlobalTab from "view/common/GlobalTab";
import { styled } from "@material-ui/styles";
import { Button, Paper, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import FieldContentWrapper from "component/FieldContentWrapper";
import FieldContentBottomWrapper from "component/FieldContentBottomWrapper";
import { IMAGE_SIZE_HEIGHT, IMAGE_SIZE_WIDTH, ROUTE_NOTICE } from "common/Constant";
import Loading from "component/Loading";
import { DEFAULT_MEMBER_DATA, Member } from "interface/Member";
import MemberDataHook from "api/MemberDataHook";
import { LocalFile } from "interface/LocalFile";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import GoogleMapReact from "google-map-react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { auth } from "config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, KEY_ACCOUNT } from "common/Utils";
import { addMember } from "api/FirebaseApi";
const ID_NAME = "name";
const ID_AGE = "age";
const ID_CONTACT = "contact";
const ID_IMAGE = "image";
const ID_ADDRESS = "address";
const ID_LATITUDE = "latitude";
const ID_LONGITUDE = "longitude";
const ID_CREATOR = "creator";
const ID_MEMO = "memo";
const ID_CREATE_TIME = "create_time";
const ID_UPDATE_TIME = "update_time";
const ID_ACCOUNT_ID = "account_id";

const LABEL_NAME = "이름";
const LABEL_AGE = "나이";
const LABEL_CONTACT = "연락처";
const LABEL_IMAGE = "사진";
const LABEL_ADDRESS = "주소";
const LABEL_LATITUDE = "위도";
const LABEL_LONGITUDE = "경도";
const LABEL_CREATOR = "생성자";
const LABEL_MEMO = "메모";
const LABEL_CREATE_TIME = "생성 시간";
const LABEL_UPDATE_TIME = "업데이트 시간";
const LABEL_MANAGER = "담당자";
const LABEL_ADD = "추가";
const LABEL_UPDATE = "수정";
const LABEL_DELETE = "삭제";
const LABEL_CANCEL = "취소";

const MSG_ERR_TITLE = "제목을 입력하세요.";
const MSG_ERR_CONTENTS = "내용을 입력하세요";
const MSG_COMPLETED = "완료되었습니다.";
const MSG_FAILED = "실패하였습니다.";
const MSG_DELETED = "삭제되었습니다.";
const DEFAULT_FIELD_WIDTH = 400;

const FieldWrapper = styled(Paper)({
  margin: 10,
  padding: 50,
  minWidth: 500,
  textAlign: "center",
});

const MemberEditView = () => {
  const { memberList } = MemberDataHook();
  const params = useParams();
  const id = params.id;
  const isAdd = id === "-1";
  const navigate = useNavigate();
  const [member, setMember] = useState<Member>(DEFAULT_MEMBER_DATA);
  const [updating, setUpdating] = useState(false);
  const [localFile, setLocalFile] = useState<LocalFile>({
    name: null,
    path: null,
    file: null,
  });
  const fileRef = useRef<any>(null);
  useEffect(() => {
    if (!isAdd) {
      const data = memberList?.filter((data) => {
        return data.id === id;
      });
      if (data) {
        setMember(data[0]);
      }
    }
    member.accountId = getStorage(KEY_ACCOUNT);
    member.writer = getStorage(KEY_ACCOUNT);
    setMember({ ...member });
  }, [memberList, isAdd, id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;
    if (member) {
      switch (id) {
        case ID_NAME:
          member.name = value;
          break;
        case ID_CONTACT:
          member.phone = value;
          break;
        case ID_ADDRESS:
          member.address = value;
          break;
        case ID_MEMO:
          member.memo = value;
          break;
        case ID_ACCOUNT_ID:
          member.accountId = value;
          break;
        default:
          break;
      }
    }
    setMember({ ...member });
  };

  const onDeleteClick = async () => {
    setUpdating(true);
    // await deleteNotice(notice);
    alert(MSG_DELETED);
    setUpdating(false);
    navigate(ROUTE_NOTICE);
  };

  const onAddClick = async () => {
    if (!member.name) {
      alert("이름을 입력하세요.");
      return;
    } else if (!member.age) {
      alert("나이를 입력하세요.");
      return;
    } else if (!member.phone) {
      alert("연락처를 입력하세요.");
      return;
    } else if (!member.address) {
      alert("주소를 입력하세요.");
      return;
    }
    setUpdating(true);
    const result = await addMember(member,localFile,isAdd)
    if (result) {
      alert(MSG_COMPLETED);
    } else {
      alert(MSG_FAILED);
    }
    setUpdating(false);
  };
  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e?.target;
    if (!input.files?.length) {
      return;
    }

    const file_object = input.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      localFile.name = file_object.name;
      localFile.file = file_object;
      localFile.path = reader.result;
      setLocalFile({ ...localFile });
    };

    reader.readAsDataURL(file_object);
  };

  const onDateChange = (e: Date | null) => {
    if (e) {
      const year = e.getFullYear();
      const month = e.getMonth() + 1;
      let month_text: string = month.toString();
      if (month < 10) {
        month_text = "0" + month_text;
      }
      let date = e.getDate();
      let date_text: string = date.toString();
      if (date < 10) {
        date_text = "0" + date_text;
      }
      member.age = year + "/" + month_text + "/" + date_text;
      setMember({ ...member });
    }
  };

  const onImageResetClick = () => {
    localFile.name = null;
    localFile.file = null;
    localFile.path = "";
    fileRef.current.value = null;
    setLocalFile({ ...localFile });
  };
  const getCommonField = (label: string, id: string, width: number, value: string) => {
    return (
      <FieldWrapper>
        <CustomLabel label={label} size={LABEL_SIZE_SMALL} />
        <TextField autoComplete="off" sx={{ width: width }} id={id} type="text" value={value} onChange={onChange} />
      </FieldWrapper>
    );
  };

  const getImageField = () => {
    let imgSrc = "";
    if (localFile.path) {
      imgSrc = localFile.path;
    } else if (member.image) {
      imgSrc = member.image;
    }
    return (
      <FieldWrapper>
        <CustomLabel label={LABEL_IMAGE} size={LABEL_SIZE_SMALL} />
        <input ref={fileRef} type="file" accept="image/" onChange={onImageChange} />
        {imgSrc ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src={imgSrc} width={IMAGE_SIZE_WIDTH} height={IMAGE_SIZE_HEIGHT} alt="logo" />
              <Button variant="contained" onClick={onImageResetClick}>
                초기화
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
      </FieldWrapper>
    );
  };

  const getMemoField = (label: string, id: string, width: number, value: string) => {
    return (
      <FieldWrapper>
        <CustomLabel label={label} size={LABEL_SIZE_SMALL} />
        <TextField autoComplete="off" sx={{ width: width }} id={id} type="text" value={value} multiline maxRows={10} onChange={onChange} />
      </FieldWrapper>
    );
  };
  const getAgeField = () => {
    return (
      <FieldWrapper>
        <CustomLabel label={LABEL_AGE} size={LABEL_SIZE_SMALL} />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker label={LABEL_AGE} inputFormat="yyyy//MM/dd" value={member.age} onChange={onDateChange} renderInput={(params) => <TextField {...params} />} />
        </LocalizationProvider>
      </FieldWrapper>
    );
  };
  const NAME_FIELD = getCommonField(LABEL_NAME, ID_NAME, DEFAULT_FIELD_WIDTH, member.name);
  const AGE_FIELD = getAgeField();

  const PHONE_FIELD = getCommonField(LABEL_CONTACT, ID_CONTACT, DEFAULT_FIELD_WIDTH, member.phone.toString());
  const IMAGE_FIELD = getImageField();
  const ADDRESS_FILED = getCommonField(LABEL_ADDRESS, ID_ADDRESS, DEFAULT_FIELD_WIDTH, member.address.toString());
  const MEMO_FIELD = getMemoField(LABEL_MEMO, ID_MEMO, DEFAULT_FIELD_WIDTH, member.memo);
  const MANAGER_FIELD = getCommonField(LABEL_MANAGER, ID_ACCOUNT_ID, DEFAULT_FIELD_WIDTH, member.accountId);
  if (updating) {
    return <Loading />;
  }
  return (
    <>
      <GlobalTab />
      <FieldContentWrapper>
        {NAME_FIELD}
        {AGE_FIELD}
        {PHONE_FIELD}
        {IMAGE_FIELD}
        {ADDRESS_FILED}
        <div style={{ height: 500, width: 500 }}>
          <GoogleMapReact bootstrapURLKeys={{ key: "AIzaSyDtpMKacZ8fsVuoaLABAQ7b113CBUZOKcY" }} defaultCenter={{ lat: 29.68402678282475, lng: -8.320964890236837 }} defaultZoom={2}></GoogleMapReact>
        </div>
        {MEMO_FIELD}
        {MANAGER_FIELD}
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

export default MemberEditView;
