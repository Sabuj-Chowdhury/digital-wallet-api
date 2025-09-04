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
    statusCode: 200,
    success: true,
    message: "All Transactions retrieved Successfully",
    data: transactions,
  });
});

const getMyTransactions = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const loginSlug = decodedToken.slug;
    const userId = decodedToken.userId;
    const slug = req.params.slug;
    const query = req.query;

    const transactions = await TransactionService.getMyTransactions(
      loginSlug,
      slug,
      userId,
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Transactions Retrieved Successfully",
      meta: transactions.meta,
      data: transactions.data,
    });
  }
);

export const TransactionController = {
  getAllTransactions,
  getMyTransactions,
};
