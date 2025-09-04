import mongoose from "mongoose";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import AppError from "../../errorHelper/AppError";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "../transaction/transaction.model";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";

const cashIn = async (agentId: string, userId: string, amount: number) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Verify agent
    const agent = await User.findById(agentId).populate(
      "wallet",
      "balance status"
    );

    if (!agent || agent.role !== "AGENT") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only agents can perform Cash-In"
      );
    }
    if ((agent.wallet as JwtPayload).status === "SUSPENDED") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Agent Wallet is Suspend, Not ready to Cash-In"
      );
    }

    // Find user wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (wallet.status === "BLOCKED") {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet is not active");
    }

    // Update balance
    wallet.balance += amount;
    await wallet.save({ session });

    // transaction
    await Transaction.create(
      [
        {
          type: TransactionType.CASH_IN,
          amount,
          fromUser: agentId,
          toUser: userId,
          initiatedBy: agentId,
          status: TransactionStatus.COMPLETED,
          meta: { method: "Agent Cash-In" },
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return wallet;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const AgentService = {
  cashIn,
};
