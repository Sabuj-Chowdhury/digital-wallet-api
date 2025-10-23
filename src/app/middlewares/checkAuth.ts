import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import AppError from "../errorHelper/AppError";
import { verifyTokenFn } from "../utils/jwt";
import { envVariable } from "../config/enVariable";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization || req.cookies.accessToken;

      // jwt token check
      if (!accessToken) {
        throw new AppError(httpStatus.FORBIDDEN, "No token received");
      }

      // jwt token verified
      const verifiedToke = verifyTokenFn(
        accessToken,
        envVariable.JWT_ACCESS_SECRET
      ) as JwtPayload;

      // phone check
      const isUserExist = await User.findOne({ phone: verifiedToke.phone });

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

      // user role check
      if (!authRoles.includes(verifiedToke.role)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You are not permitted to view this route!!"
        );
      }

      req.user = verifiedToke;

      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
