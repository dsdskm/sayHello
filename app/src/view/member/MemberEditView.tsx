/* eslint-disable */
import CustomLabel, { LABEL_SIZE_SMALL } from "component/Labels";
import GlobalTab from "view/common/GlobalTab";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import FieldContentWrapper from "component/FieldContentWrapper";
import FieldContentBottomWrapper from "component/FieldContentBottomWrapper";
import {
  DEFAULT_FIELD_WIDTH,
  IMAGE_SIZE_HEIGHT,
  IMAGE_SIZE_WIDTH,
  LARGE_FIELD_WIDTH,
  MAP_CENTER,
  ROUTE_MEMBER,
} from "common/Constant";
import Loading from "component/Loading";
import { DEFAULT_MEMBER_DATA, Member } from "interface/Member";
import MemberDataHook from "api/MemberDataHook";
import { LocalFile } from "interface/LocalFile";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getAge, getPhoneFormat } from "common/Utils";
import {
  addMember,
  deleteEventAllByMember,
  deleteHelloAllByMember,
  deleteMember,
  searchAddress,
} from "api/FirebaseApi";
import MemberEventView from "./event/MemberEventView";
import MemberHelloView from "./hello/MemberHelloView";
import { FieldWrapper, FieldWrapperSmall } from "component/FieldWrapper";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "config/FirebaseConfig";
import AccountDataHook from "api/AccountDataHook";
import { Account, DEFAULT_ACCOUNT_DATA } from "interface/Account";
import { EventData } from "interface/EventData";
import { AccountKey } from "./MemberListView";

const ID_NAME = "name";
const ID_CONTACT = "contact";
const ID_ADDRESS = "address";
const ID_MEMO = "memo";
const ID_SEX = "sex";
const ID_PARTNER = "partner";
const ID_CHILD = "child";
const ID_DISABLED = "disabled";
const ID_LEVEL = "level";
const ID_AGE = "age";
const ID_MANAGER = "manager";

const LABEL_NAME = "이름";
const LABEL_AGE = "나이";
const LABEL_BORN = "출생";
const LABEL_CONTACT = "연락처";
const LABEL_IMAGE = "사진";
const LABEL_ADDRESS = "주소";
const LABEL_MEMO = "메모";
const LABEL_MANAGER = "담당자";
const LABEL_SEX = "성별";
const LABEL_MALE = "남";
const LABEL_FEMALE = "여";
const LABEL_PARTNER = "배우자";
const LABEL_CHILD = "자식";
const LABEL_DISALBED = "장애";
const LABEL_LEVEL = "중요도";
const LABEL_ADD = "추가";
const LABEL_UPDATE = "수정";
const LABEL_DELETE = "삭제";
const LABEL_CANCEL = "취소";
const LABEL_OK = "확인";
const LABEL_SEARCH = "검색";
const LABEL_RESET = "초기화";
const LABEL_LATITUDE = "위도";
const LABEL_LONGITUDE = "경도";
const LABEL_TRUE = "있음";
const LABEL_FALSE = "없음";
export const LABEL_LEVEL_VERY_LOW = "보통";
export const LABEL_LEVEL_LOW = "관심";
export const LABEL_LEVEL_NORMAL = "중요";
export const LABEL_LEVEL_HIGH = "높음";
export const LABEL_LEVEL_VERY_HIGH = "매우높음";

const MSG_COMPLETED = "완료되었습니다.";
const MSG_FAILED = "실패하였습니다.";
const MSG_DELETE = "삭제하시겠습니까? 모든 정보가 삭제됩니다.";
const MSG_DELETED = "삭제되었습니다.";
const MSG_ERROR_NAME = "이름을 입력하세요.";
const MSG_ERROR_AGE = "나이를 입력하세요.";
const MSG_ERROR_CONTACT = "연락처를 입력하세요.";
const MSG_ERROR_ADDRESS = "주소를 입력하세요.";
const MSG_ERROR_EDIT = "담당자만 수정/삭제가 가능합니다.";

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
  const [memoArr, setMemoArr] = useState<Array<string>>([]);
  const [nameList, setNameList] = useState<AccountKey | undefined>();
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
    const initNameList = () => {
      if (accountList) {
        let tmpHash: AccountKey = {};
        accountList.forEach((account) => {
          tmpHash[account.email] = [account.name, account.phone];
        });
        setNameList(tmpHash);
      }
    };

    initNameList();
  }, [auth, accountList]);
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
        if (data && data[0]) {
          setMemoArr(data[0].memo);
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
        default:
          break;
      }
      setMember({ ...member });
    }
  };

  const onDeleteClick = async () => {
    if (window.confirm(MSG_DELETE)) {
      try {
        setUpdating(true);
        await deleteMember(member);
        await deleteHelloAllByMember(member);
        await deleteEventAllByMember(member);
        navigate(ROUTE_MEMBER);
        alert(MSG_DELETED);
      } catch (e) {
        navigate(ROUTE_MEMBER);
        alert(MSG_DELETED);
      }
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
    member.memo = memoArr;
    const result = await addMember(member, localFile, isAdd);

    // 매년 생일 카드를 어떻게 뜨게 할지?
    const eventTime = new Date();
    eventTime.setFullYear(+member.age.split("/")[0]);
    eventTime.setMonth(+member.age.split("/")[1] - 1);
    eventTime.setDate(+member.age.split("/")[2]);
    eventTime.setHours(7);
    eventTime.setMinutes(0);
    const eventData = {
      id: new Date().getTime().toString(),
      text: "생일",
      member_id: member.id,
      name: member.name,
      year: eventTime.getFullYear(),
      month: eventTime.getMonth() + 1,
      date: eventTime.getDate(),
      hour: eventTime.getHours(),
      min: eventTime.getMinutes(),
      eventTime: eventTime.getTime(),
      checked: false,
      image: member.image,
      writer: user,
    } as EventData;
    // await addEvent(eventData);

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
    try {
      const ret: any = await searchAddress(member.address);
      const address = ret.addresses[0];
      const lat = address.y;
      const lon = address.x;
      member.latitude = lat;
      member.longitude = lon;
      setMember({ ...member });
      setSearching(false);
    } catch (e) {
      setSearching(false);
    }
  };
  const getCommonField = (label: string, id: string, width: number, value: string) => {
    return (
      <FieldWrapper key={id}>
        <CustomLabel label={label} size={LABEL_SIZE_SMALL} />
        <TextField autoComplete="off" sx={{ width: width }} id={id} type="text" value={value} onChange={onChange} />
      </FieldWrapper>
    );
  };
  const getAddressField = (label: string, id: string, width: number, value: string) => {
    return (
      <FieldWrapper key={id}>
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
      <FieldWrapper key="image">
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
              <Button variant="contained" onClick={onImageResetClick} sx={{ m: 1 }}>
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

  const getSexField = () => {
    return (
      <FieldWrapperSmall key={ID_SEX}>
        <CustomLabel label={LABEL_SEX} size={LABEL_SIZE_SMALL} />
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={member.sex}
            onChange={(e) => {
              member.sex = e.target.value;
              setMember({ ...member });
            }}
          >
            <FormControlLabel value="male" control={<Radio />} label={LABEL_MALE} />
            <FormControlLabel value="female" control={<Radio />} label={LABEL_FEMALE} />
          </RadioGroup>
        </FormControl>
      </FieldWrapperSmall>
    );
  };

  const getPartnerField = () => {
    return (
      <FieldWrapperSmall key={ID_PARTNER}>
        <CustomLabel label={LABEL_PARTNER} size={LABEL_SIZE_SMALL} />
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={member.partner}
            onChange={(e) => {
              member.partner = e.target.value;
              setMember({ ...member });
            }}
          >
            <FormControlLabel value={LABEL_TRUE} control={<Radio />} label={LABEL_TRUE} />
            <FormControlLabel value={LABEL_FALSE} control={<Radio />} label={LABEL_FALSE} />
          </RadioGroup>
        </FormControl>
      </FieldWrapperSmall>
    );
  };
  const getChildField = () => {
    return (
      <FieldWrapperSmall key={ID_CHILD}>
        <CustomLabel label={LABEL_CHILD} size={LABEL_SIZE_SMALL} />
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={member.child}
            onChange={(e) => {
              member.child = e.target.value;
              setMember({ ...member });
            }}
          >
            <FormControlLabel value={LABEL_TRUE} control={<Radio />} label={LABEL_TRUE} />
            <FormControlLabel value={LABEL_FALSE} control={<Radio />} label={LABEL_FALSE} />
          </RadioGroup>
        </FormControl>
      </FieldWrapperSmall>
    );
  };
  const getDisabledField = () => {
    return (
      <FieldWrapperSmall key={ID_DISABLED}>
        <CustomLabel label={LABEL_DISALBED} size={LABEL_SIZE_SMALL} />
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={member.disabled}
            onChange={(e) => {
              member.disabled = e.target.value;
              setMember({ ...member });
            }}
          >
            <FormControlLabel value={LABEL_TRUE} control={<Radio />} label={LABEL_TRUE} />
            <FormControlLabel value={LABEL_FALSE} control={<Radio />} label={LABEL_FALSE} />
          </RadioGroup>
        </FormControl>
      </FieldWrapperSmall>
    );
  };

  const getLevelField = () => {
    return (
      <FieldWrapperSmall key={ID_LEVEL}>
        <CustomLabel label={LABEL_LEVEL} size={LABEL_SIZE_SMALL} />
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={member.level}
            onChange={(e) => {
              member.level = +e.target.value;
              setMember({ ...member });
            }}
          >
            <FormControlLabel value="1" control={<Radio />} label={LABEL_LEVEL_VERY_LOW} />
            <FormControlLabel value="2" control={<Radio />} label={LABEL_LEVEL_LOW} />
            <FormControlLabel value="3" control={<Radio />} label={LABEL_LEVEL_NORMAL} />
            <FormControlLabel value="4" control={<Radio />} label={LABEL_LEVEL_HIGH} />
            <FormControlLabel value="5" control={<Radio />} label={LABEL_LEVEL_VERY_HIGH} />
          </RadioGroup>
        </FormControl>
      </FieldWrapperSmall>
    );
  };

  const getManagerField = () => {
    return (
      <FieldWrapperSmall key={ID_MANAGER}>
        <CustomLabel label={LABEL_MANAGER} size={LABEL_SIZE_SMALL} />
        <FormControl sx={{ m: 1, width: 400 }}>
          <InputLabel id="demo-simple-select-label">{LABEL_MANAGER}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={member.accountId}
            label="Manager"
            onChange={(e) => {
              member.accountId = e.target.value;
              setMember({ ...member });
            }}
          >
            {accountList &&
              accountList.map((account, index) => {
                return (
                  <MenuItem value={account.email} key={index}>
                    {account.name}({account.email})
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </FieldWrapperSmall>
    );
  };

  const onMemoAddClick = () => {
    setMemoArr([...memoArr, ""]);
  };
  const onMemoChange = (value: string, index: number) => {
    const tmpArr = memoArr;
    tmpArr[index] = value;
    setMemoArr(tmpArr);

    member.memo = tmpArr;
    setMember({ ...member });
  };

  const onMemoDelete = (index: number) => {
    const tmpArr = memoArr;
    const filteredArr = tmpArr.filter((v, i) => {
      return index != i;
    });
    setMemoArr(filteredArr);
    member.memo = filteredArr;
    setMember({ ...member });
  };
  const getMemoField = (label: string, id: string, width: number, memo: Array<string>) => {
    return (
      <FieldWrapper id={id}>
        <CustomLabel label={label} size={LABEL_SIZE_SMALL} />
        <Box display="flex" flexDirection="column" alignItems="center">
          {memoArr.map((value, index) => {
            return (
              <Box>
                <TextField
                  autoComplete="off"
                  sx={{ width: width }}
                  id={id}
                  type="text"
                  value={memo[index]}
                  multiline
                  maxRows={10}
                  onChange={(e) => {
                    onMemoChange(e.target.value, index);
                  }}
                />
                <Button
                  sx={{ color: "red", m: 1 }}
                  onClick={(e) => {
                    onMemoDelete(index);
                  }}
                >
                  {LABEL_DELETE}
                </Button>
              </Box>
            );
          })}
          <Button sx={{ m: 1 }} onClick={onMemoAddClick}>
            {LABEL_ADD}
          </Button>
        </Box>
      </FieldWrapper>
    );
  };
  const getAgeField = () => {
    return (
      <FieldWrapper id={ID_AGE}>
        <CustomLabel label={LABEL_AGE} size={LABEL_SIZE_SMALL} />
        {member.age && <Typography>{getAge(member.age)}세</Typography>}
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

  if (!member) {
    navigate(ROUTE_MEMBER);
  }
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
  const MEMO_FIELD = getMemoField(LABEL_MEMO, ID_MEMO, LARGE_FIELD_WIDTH, member.memo);
  const MANAGER_FIELD = getManagerField();
  const SEX_FIELD = getSexField();
  const PARTNER_FIELD = getPartnerField();
  const CHILD_FIELD = getChildField();
  const DISABLED_FIELD = getDisabledField();
  const LEVEL_FIELD = getLevelField();
  if (updating) {
    return <Loading />;
  }
  return (
    <>
      <GlobalTab />
      <FieldContentWrapper>
        <div style={{ display: "flex", overflow: "scroll" }}>
          {NAME_FIELD}
          {AGE_FIELD}
          {PHONE_FIELD}
        </div>
        <div style={{ display: "flex", overflow: "scroll" }}>
          {SEX_FIELD}
          {PARTNER_FIELD}
          {CHILD_FIELD}
          {DISABLED_FIELD}
          {LEVEL_FIELD}
        </div>
        <div style={{ display: "flex", overflow: "scroll" }}>
          {IMAGE_FIELD}
          {ADDRESS_FILED}
        </div>
        {MEMO_FIELD}
        {MANAGER_FIELD}
        {isAdd ? (
          <></>
        ) : (
          <>
            <MemberEventView user={user} member={member} nameList={nameList} />
            <MemberHelloView user={user} member={member} nameList={nameList} />
          </>
        )}
      </FieldContentWrapper>
      <FieldContentBottomWrapper>
        {isAdd || (memberAccountId && user === memberAccountId) || account.type === "master" ? (
          <>
            <Button sx={{ m: 1 }} variant="contained" onClick={() => navigate(ROUTE_MEMBER)}>
              {LABEL_CANCEL}
            </Button>
            {isAdd ? (
              <></>
            ) : (
              <Button sx={{ m: 1, backgroundColor: "red" }} variant="contained" onClick={onDeleteClick}>
                {LABEL_DELETE}
              </Button>
            )}
            <Button sx={{ m: 1 }} variant="contained" onClick={onAddClick}>
              {isAdd ? LABEL_ADD : LABEL_UPDATE}
            </Button>
          </>
        ) : (
          <>
            <Box display="flex" alignItems="center">
              <Typography>{MSG_ERROR_EDIT}</Typography>
              <Button sx={{ m: 1 }} variant="contained" onClick={() => navigate(ROUTE_MEMBER)}>
                {LABEL_OK}
              </Button>
            </Box>
          </>
        )}
      </FieldContentBottomWrapper>
    </>
  );
};

export default MemberEditView;
