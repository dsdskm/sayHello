export const MARGIN_DEFAULT = 10;
export const LOGO_IMAGE_WIDTH = "250px";
export const LOGO_IMAGE_HEIGHT = "75px";
export const PROFILE_IMAGE_WIDTH = "75px";
export const PROFILE_IMAGE_HEIGHT = "75px";
export const IMAGE_SIZE_WIDTH = 400;
export const IMAGE_SIZE_HEIGHT = 400;

export const ROUTE_ID = "/:id";
export const ROUTE_EDIT = "/edit";
export const ROUTE_LOGIN = "/";
export const ROUTE_JOIN = "/join";
export const ROUTE_DASHBOARD = "/dashboard";
export const ROUTE_MEMBER = "/member";
export const ROUTE_NOTICE = "/notice";
export const ROUTE_NOTICE_EDIT = ROUTE_NOTICE + ROUTE_EDIT;
export const ROUTE_ACCOUNT = "/account";
export const ROUTE_ACCOUNT_EDIT = ROUTE_ACCOUNT + ROUTE_EDIT;

export const ACCOUNT_TYPE_MASTER = "master";
export const ACCOUNT_TYPE_NORMAL = "normal";

export const ROUTE_DEBUG = "/debug";

export const LOGO_IMAGE = process.env.PUBLIC_URL + "/images/app_icon.png";
export const DEFAULT_PROFILE_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/sayhello-8de64.appspot.com/o/images%2Fsample%2Fpeople.jpeg?alt=media&token=f52effdb-7da7-4549-8b7e-6d963a418992";
export const LOGO_IMAGE_COMPONENT = (
  <img
    src={LOGO_IMAGE}
    alt="logo"
    style={{
      margin: MARGIN_DEFAULT,
      width: LOGO_IMAGE_WIDTH,
      height: LOGO_IMAGE_HEIGHT,
    }}
    onClick={() => {
      window.location.href = `/`;
    }}
  />
);

export const getLogoImageComponent = (path: string, callback: (path: string) => void) => {
  return (
    <img
      src={LOGO_IMAGE}
      alt="logo"
      style={{
        margin: MARGIN_DEFAULT,
        width: LOGO_IMAGE_WIDTH,
        height: LOGO_IMAGE_HEIGHT,
      }}
      onClick={() => {
        callback(path);
      }}
    />
  );
};
