import { Box, Paper, TextField } from "@mui/material";
import { Container } from "@mui/system";
import GlobalTab from "view/common/GlobalTab";
import { styled } from "@material-ui/styles";
import CustomLabel, { LABEL_SIZE_SMALL } from "component/Labels";
import React, { useEffect, useState } from "react";
import DataHook from "api/DataHook";
import { useParams } from "react-router-dom";
import { Account, DEFAULT_ACCOUNT_DATA } from "interface/Account";
import JoinView from "view/join/JoinView";

const LABEL_ID = "ID";
const ID = "id";
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
  console.log(`queryId ${queryId}`);
  const [account, setAccount] = useState<Account>(DEFAULT_ACCOUNT_DATA);
  useEffect(() => {
    if (queryId) {
      accountList?.filter((data) => {
        if (data.id === queryId) {
          setAccount(data);
        }
      });
    }
  }, [accountList, queryId]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const getCommonField = (label: string, id: string, width: number, value: string) => {
    return (
      <FieldWrapper>
        <CustomLabel label={label} size={LABEL_SIZE_SMALL} />
        <TextField sx={{ width: width }} id={id} type="text" value={value} onChange={onChange} />
      </FieldWrapper>
    );
  };

  const ID_FIELD = getCommonField(LABEL_ID, ID, DEFAULT_FIELD_WIDTH, account?.id);

  return (
    <>
      <GlobalTab />
    </>
  );
};

export default AccountEditView;
