/* eslint-disable */
import CustomLabel, { LABEL_SIZE_SMALL } from "component/Labels";
import GlobalTab from "view/common/GlobalTab";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import FieldContentWrapper from "component/FieldContentWrapper";
import FieldContentBottomWrapper from "component/FieldContentBottomWrapper";
import { DEFAULT_FIELD_WIDTH, IMAGE_SIZE_HEIGHT, IMAGE_SIZE_WIDTH, MAP_CENTER, ROUTE_MEMBER } from "common/Constant";
import Loading from "component/Loading";
import { DEFAULT_MEMBER_DATA, Member } from "interface/Member";
import MemberDataHook from "api/MemberDataHook";
import { LocalFile } from "interface/LocalFile";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getAge, getPhoneFormat } from "common/Utils";
import { addMember, deleteEventByMember, deleteHello, deleteMember, searchAddress } from "api/FirebaseApi";
import MemberEventView from "./event/MemberEventView";
import MemberHelloView from "./hello/MemberHelloView";
import { FieldWrapper } from "component/FieldWrapper";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "config/FirebaseConfig";
import AccountDataHook from "api/AccountDataHook";
import { Account, DEFAULT_ACCOUNT_DATA } from "interface/Account";

const ID_NAME = "name";
const ID_CONTACT = "contact";
const ID_ADDRESS = "address";
const ID_MEMO = "memo";
const ID_ACCOUNT_ID = "account_id";

const LABEL_NAME = "이름";
const LABEL_AGE = "나이";
const LABEL_BORN = "출생";
const LABEL_CONTACT = "연락처";
const LABEL_IMAGE = "사진";
const LABEL_ADDRESS = "주소";
const LABEL_MEMO = "메모";
const LABEL_MANAGER = "담당자";
const LABEL_ADD = "추가";
const LABEL_UPDATE = "수정";
const LABEL_DELETE = "삭제";
const LABEL_CANCEL = "취소";
const LABEL_OK = "확인";
const LABEL_SEARCH = "검색";
const LABEL_RESET = "초기화";
const LABEL_LATITUDE = "위도";
const LABEL_LONGITUDE = "경도";

const MSG_COMPLETED = "완료되었습니다.";
const MSG_FAILED = "실패하였습니다.";
const MSG_DELETE = "삭제하시겠습니까? 모든 정보가 삭제됩니다.";
const MSG_DELETED = "삭제되었습니다.";
const MSG_ERROR_NAME = "이름을 입력하세요.";
const MSG_ERROR_AGE = "나이를 입력하세요.";
const MSG_ERROR_CONTACT = "연락처를 입력하세요.";
const MSG_ERROR_ADDRESS = "주소를 입력하세요.";

const MemberEditView = () => {
  const { memberList } = MemberDataHook();
  const params = useParams();
  const id = params.id;
  const isAdd = id === "-1";
  const navigate = useNavigate();
  const [member, setMember] = useState<Member>(DEFAULT_MEMBER_DATA);
  const [account, setAccount] = useState<Account>(DEFAULT_ACCOUNT_DATA);
  const [updating, setUpdating] = useState(false);
  const [searching, setSearching] = useState(false);
  const [localFile, setLocalFile] = useState<LocalFile>({
    name: null,
    path: null,
    file: null,
  });
  const [user, setUser] = useState<string>();
  const [memberAccountId, setMemberAccountId] = useState<string>();
  const { accountList } = AccountDataHook();
  const fileRef = useRef<any>(null);
  let map: naver.maps.Map;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUser(user.email);
        if (accountList) {
          const account = accountList?.filter((data) => {
            return data.email === user.email;
          });
          setAccount(account[0]);
        }
      }
    });
  }, [auth,accountList]);
  useEffect(() => {
    const initMap = () => {
      try {
        let centerPos;
        if (member.latitude && member.longitude) {
          centerPos = new naver.maps.LatLng(member.latitude, member.longitude);
        } else {
          centerPos = MAP_CENTER;
        }
        map = new naver.maps.Map("map", {
          center: centerPos,
          zoom: 12,
          scaleControl: false,
          logoControl: false,
          mapDataControl: false,
          zoomControl: true,
        });
        if (member) {
          addMarker(member.latitude, member.longitude);
        }
      } catch (e) {
        console.log(e);
      }
    };
    initMap();
  }, [member]);
  useEffect(() => {
    if (user) {
      if (isAdd) {
        member.accountId = user;
        member.writer = user;
        setMember({ ...member });
      } else {
        const data = memberList?.filter((data) => {
          return data.id === id;
        });
        if (data) {
          setMember(data[0]);
          setMemberAccountId(data[0].accountId);
        }
      }
    }
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
    if (window.confirm(MSG_DELETE)) {
      setUpdating(true);
      await deleteMember(member);
      await deleteHello(member);
      await deleteEventByMember(member);
      alert(MSG_DELETED);
      setUpdating(false);
      navigate(ROUTE_MEMBER);
    }
  };

  const onAddClick = async () => {
    if (!member.name) {
      alert(MSG_ERROR_NAME);
      return;
    } else if (!member.age) {
      alert(MSG_ERROR_AGE);
      return;
    } else if (!member.phone) {
      alert(MSG_ERROR_CONTACT);
      return;
    } else if (!member.address) {
      alert(MSG_ERROR_ADDRESS);
      return;
    }
    setUpdating(true);
    const result = await addMember(member, localFile, isAdd);
    if (result) {
      alert(MSG_COMPLETED);
    } else {
      alert(MSG_FAILED);
    }
    setUpdating(false);
    navigate(ROUTE_MEMBER);
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

  const addMarker = (lat: number, lon: number) => {
    if (map) {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lon),
        map: map,
        icon: {
          content: `
              <img alt="marker" src="http://maps.google.com/mapfiles/ms/micons/red.png" />
            `,
        },
      });
    }
  };
  const onSearchClick = async () => {
    setSearching(true);
    const ret: any = await searchAddress(member.address);
    const address = ret.addresses[0];
    const lat = address.y;
    const lon = address.x;
    member.latitude = lat;
    member.longitude = lon;
    setMember({ ...member });
    setSearching(false);
  };
  const getCommonField = (label: string, id: string, width: number, value: string) => {
    return (
      <FieldWrapper>
        <CustomLabel label={label} size={LABEL_SIZE_SMALL} />
        <TextField autoComplete="off" sx={{ width: width }} id={id} type="text" value={value} onChange={onChange} />
      </FieldWrapper>
    );
  };
  const getAddressField = (label: string, id: string, width: number, value: string) => {
    return (
      <FieldWrapper>
        <CustomLabel label={label} size={LABEL_SIZE_SMALL} />
        <Box display="flex" justifyContent="center">
          <TextField autoComplete="off" sx={{ width: width }} id={id} type="text" value={value} onChange={onChange} />
          {!searching && <Button onClick={onSearchClick}>{LABEL_SEARCH}</Button>}
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography sx={{ m: 1 }}>
            {LABEL_LATITUDE} {member.latitude}
          </Typography>
          <Typography sx={{ m: 1 }}>
            {LABEL_LONGITUDE} {member.longitude}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" sx={{ ml: 10, mr: 10 }}>
          <div id="map" style={{ height: 500, width: 500 }}></div>
        </Box>
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
                {LABEL_RESET}
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
  const getAgeField = () => {
    return (
      <FieldWrapper>
        <CustomLabel label={LABEL_AGE} size={LABEL_SIZE_SMALL} />
        <Typography>{getAge(member.age)}세</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label={LABEL_BORN}
            inputFormat="yyyy/MM/dd"
            value={member.age}
            onChange={onDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </FieldWrapper>
    );
  };

  const NAME_FIELD = getCommonField(LABEL_NAME, ID_NAME, DEFAULT_FIELD_WIDTH, member.name);
  const AGE_FIELD = getAgeField();
  const PHONE_FIELD = getCommonField(
    LABEL_CONTACT,
    ID_CONTACT,
    DEFAULT_FIELD_WIDTH,
    getPhoneFormat(member.phone.toString())
  );
  const IMAGE_FIELD = getImageField();
  const ADDRESS_FILED = getAddressField(LABEL_ADDRESS, ID_ADDRESS, DEFAULT_FIELD_WIDTH, member.address.toString());
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
        {MEMO_FIELD}
        {MANAGER_FIELD}
        {isAdd ? (
          <></>
        ) : (
          <>
            <MemberEventView user={user} member={member} />
            <MemberHelloView user={user} member={member} />
          </>
        )}
      </FieldContentWrapper>
      <FieldContentBottomWrapper>
        {(memberAccountId && user === memberAccountId) || account.type === "master" ? (
          <>
            <Button sx={{ m: 1 }} variant="contained" onClick={() => navigate(ROUTE_MEMBER)}>
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
          </>
        ) : (
          <>
            <Button sx={{ m: 1 }} variant="contained" onClick={() => navigate(ROUTE_MEMBER)}>
              {LABEL_OK}
            </Button>
          </>
        )}
      </FieldContentBottomWrapper>
    </>
  );
};

export default MemberEditView;
