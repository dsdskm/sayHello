import { Paper, TextField } from "@mui/material";
import GlobalTab from "view/common/GlobalTab";
import { styled } from "@material-ui/styles";
import CustomLabel, { LABEL_SIZE_SMALL } from "component/Labels";
import React, { useEffect, useState } from "react";
import DataHook from "api/DataHook";
import { useParams } from "react-router-dom";
import { Account, DEFAULT_ACCOUNT_DATA } from "interface/Account";
import { IMAGE_SIZE_HEIGHT, IMAGE_SIZE_WIDTH } from "common/Constant";

const ID_NAME = "name";
const ID_EMAIL = "email";
const ID_PHONE = "phone";
const ID_ADDRESS = "address";

const LABEL_NAME = "이름";
const LABEL_IMAGE = `사진`;
const LABEL_EMAIL = "이메일";
const LABEL_PHONE = "연락처";
const LABEL_AGE = "생년월일";
const LABEL_ADDRESS = "주소";

const DEFAULT_FIELD_WIDTH = 400;

const FieldWrapper = styled(Paper)({
  margin: 10,
  padding: 50,
  minWidth: 500,
  textAlign: "center",
});

const AccountEditView = () => {
  const { accountList } = DataHook();
  const params = useParams();
  const queryId = params.id;
  const [account, setAccount] = useState<Account>(DEFAULT_ACCOUNT_DATA);
  useEffect(() => {
    if (queryId) {
      const filtered = accountList?.filter((data) => {
        return data.id === queryId;
      });
      if (filtered) {
        setAccount(filtered[0]);
      }
    }
  }, [accountList, queryId]);

  /*
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`e`);
  };
  */

  const getCommonField = (label: string, id: string, width: number, value: string) => {
    return (
      <FieldWrapper>
        <CustomLabel label={label} size={LABEL_SIZE_SMALL} />
        <TextField sx={{ width: width }} id={id} type="text" value={value} />
      </FieldWrapper>
    );
  };

  const getImageField = () => {
    let imgSrc = account.image;
    return (
      <FieldWrapper>
        <CustomLabel label={LABEL_IMAGE} size={LABEL_SIZE_SMALL} />
        {imgSrc ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src={imgSrc} width={IMAGE_SIZE_WIDTH} height={IMAGE_SIZE_HEIGHT} alt="logo" />
            </div>
          </>
        ) : (
          <></>
        )}
      </FieldWrapper>
    );
  };
  const getEmailField = () => {
    return (
      <FieldWrapper>
        <CustomLabel label={LABEL_EMAIL} size={LABEL_SIZE_SMALL} />
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <TextField
            autoComplete="off"
            sx={{ width: DEFAULT_FIELD_WIDTH, marginRight: 1 }}
            id={ID_EMAIL}
            type="email"
            value={account?.email}
          />
        </div>
      </FieldWrapper>
    );
  };

  const getAgeField = () => {
    return (
      <FieldWrapper>
        <CustomLabel label={LABEL_AGE} size={LABEL_SIZE_SMALL} />
        <TextField autoComplete="off" sx={{ width: DEFAULT_FIELD_WIDTH, marginRight: 1 }} value={account?.age} />
      </FieldWrapper>
    );
  };
  const NAME_FIELD = getCommonField(LABEL_NAME, ID_NAME, DEFAULT_FIELD_WIDTH, account?.name);
  const IMAGE_FIELD = getImageField();
  const EMAIL_FIELD = getEmailField();
  const PHONE_FIELD = getCommonField(LABEL_PHONE, ID_PHONE, DEFAULT_FIELD_WIDTH, account?.phone);
  const AGE_FIELD = getAgeField();
  const ADDRESS_FIELD = getCommonField(LABEL_ADDRESS, ID_ADDRESS, DEFAULT_FIELD_WIDTH, account?.address);

  return (
    <>
      <GlobalTab />
      {NAME_FIELD}
      {IMAGE_FIELD}
      {EMAIL_FIELD}
      {PHONE_FIELD}
      {AGE_FIELD}
      {ADDRESS_FIELD}
    </>
  );
};

export default AccountEditView;
