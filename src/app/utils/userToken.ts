import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyTokenFn } from "./jwt";
import { envVariable } from "../config/enVariable";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelper/AppError";

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    phone: user.phone,
    role: user.role,
    slug: user.slug,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVariable.JWT_ACCESS_SECRET,
    envVariable.JWT_ACCESS_EXPIRES
  );

  // refresh token
  const refreshToken = generateToken(
    jwtPayload,
    envVariable.JWT_REFRESH_SECRET,
    envVariable.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyTokenFn(
    refreshToken,
    envVariable.JWT_REFRESH_SECRET
  ) as JwtPayload;

  //email check
  const isUserExist = await User.findOne({ phone: verifiedRefreshToken.phone });

  // user validation
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User dose not Exist");
  }

  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }

  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }

  // jwt token
  const jwtPayload = {
    userId: isUserExist._id,
    phone: isUserExist.phone,
    role: isUserExist.role,
    slug: isUserExist.slug,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVariable.JWT_ACCESS_SECRET,
    envVariable.JWT_ACCESS_EXPIRES
  );
  return accessToken;
};
