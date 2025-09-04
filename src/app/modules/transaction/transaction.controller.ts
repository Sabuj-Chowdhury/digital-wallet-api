/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { TransactionService } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";

const getAllTransactions = tryCatch(async (req: Request, res: Response) => {
  const query = req.query;

  const transactions = await TransactionService.getAllTransactions(
    query as Record<string, string>
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Transactions retrieved Successfully",
    meta: transactions.meta,
    data: transactions.data,
  });
});

const getMyTransactions = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const loginSlug = decodedToken.slug;
    const userId = decodedToken.userId;
    const slug = req.params.slug;
    const query = req.query;

    const Transactions = await TransactionService.getMyTransactions(
      loginSlug,
      slug,
      userId,
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Transactions Retrieved Successfully",
      data: Transactions,
    });
  }
);

export const TransactionController = {
  getAllTransactions,
  getMyTransactions,
};
