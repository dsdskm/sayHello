export const MARGIN_DEFAULT = 10;
export const LOGO_IMAGE_WIDTH = "250px";
export const LOGO_IMAGE_HEIGHT = "75px";

export const ROUTE_LOGIN = "/";
export const ROUTE_JOIN = "/join";
export const ROUTE_DASHBOARD = "/dashboard";
export const ROUTE_MEMBER = "/member";
export const ROUTE_NOTICE = "/notice";
export const ROUTE_ACCOUNT = "/account";
export const LOGO_IMAGE = process.env.PUBLIC_URL + "/images/app_icon.png";

export const MESSAGE_LOGOUT = "로그아웃하였습니다.";

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

