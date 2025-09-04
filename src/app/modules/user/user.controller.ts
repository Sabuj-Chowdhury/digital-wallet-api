/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import tryCatch from "../../utils/tryCatch";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

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

// get all user --> ADMIN
const getAllUsers = tryCatch(async (req: Request, res: Response) => {
  const query = req.query;
  const users = await UserService.getAllUsers(query as Record<string, string>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved Successfully",
    meta: users.meta,
    data: users.data,
  });
});

// user update
const updateUser = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;

    const verifiedToken = req.user;

    const user = await UserService.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Updated Successfully",
      data: user,
    });
  }
);

// get single user
const getSingleUser = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;

    const decodeToken = req.user as JwtPayload;
    const userSlug = decodeToken.slug;

    const user = await UserService.getSingleUser(slug, userSlug);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Retrieved Successfully",
      data: user,
    });
  }
);

// Add money
const addMoney = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;
    const wallet = await UserService.addMoney(req.body, decodeToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Money added successfully",
      data: wallet,
    });
  }
);

export const UserController = {
  createUser,
  updateUser,
  getAllUsers,
  getSingleUser,
  addMoney,
};
