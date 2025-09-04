/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { WalletServices } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const getAllWallets = tryCatch(async (req: Request, res: Response) => {
  const query = req.query;
  const wallets = await WalletServices.getAllWallets(
    query as Record<string, string>
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallets retrieved Successfully",
    meta: wallets.meta,
    data: wallets.data,
  });
});

// get Wallet
const getMyWallet = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const loginSlug = decodedToken.slug;
    const { slug } = req.params;
    const userId = req.user.userId;

    const wallet = await WalletServices.getMyWallet(loginSlug, slug, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wallet Retrieved Successfully",
      data: wallet,
    });
  }
);

export const WalletController = {
  getMyWallet,
  getAllWallets,
};
