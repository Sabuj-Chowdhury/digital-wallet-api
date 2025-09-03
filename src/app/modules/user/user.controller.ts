/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import tryCatch from "../../utils/tryCatch";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";

// create user
const createUser = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  }
);

export const UserController = {
  createUser,
};
