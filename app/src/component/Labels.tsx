import { Typography } from "@mui/material";
import React, { FC } from "react";

export const LABEL_SIZE_ERROR = "subtitle2";
export const LABEL_SIZE_SMALL = "h5";
export const LABEL_SIZE_NORMAL = "h3";
export const LABEL_SIZE_BIG = "h1";

interface LabelProps {
  label?: string;
  size?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline"
    | "inherit"
    | undefined;
  fontStyle?: string;
}
const CustomLabel: React.FC<LabelProps> = ({ label = "", size = "h1", fontStyle = "italic" }) => {
  return (
    <Typography sx={{ m: 1 }} variant={size} fontStyle={fontStyle}>
      {label}
    </Typography>
  );
};

export default CustomLabel;
