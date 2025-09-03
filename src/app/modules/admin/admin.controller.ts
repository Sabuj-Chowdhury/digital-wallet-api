import { Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";
import httpStatus from "http-status-codes";

const getAllUsers = tryCatch(async (req: Request, res: Response) => {
  const users = await AdminService.getAllUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved Successfully",
    data: users,
  });
});

export const AdminController = {
  getAllUsers,
};
