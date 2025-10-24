import { Response } from "express";
// import { envVariable } from "../config/enVariable";
// import { envVariable } from "../config/enVariable";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      // secure: envVariable.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
      expires: new Date(0),
      //  maxAge: envVariable.COOKIE_EXPIRE_TIME
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      // secure: envVariable.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
      expires: new Date(0),
    });
  }
};
