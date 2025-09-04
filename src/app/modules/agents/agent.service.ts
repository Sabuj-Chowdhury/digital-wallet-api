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
import { WalletStatus } from "../wallet/wallet.interface";

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

// Cash Out
const cashOut = async (agentId: string, userId: string, amount: number) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Verify agent
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "AGENT") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only agents can perform cash-out"
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
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Wallet is not active or BLOCKED"
      );
    }

    // Fee (10%)
    const fee = Math.ceil(amount * 0.1);
    const debit = amount + fee;

    if (wallet.balance < debit) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    // Update balance
    wallet.balance -= debit;
    await wallet.save({ session });

    // Transaction
    await Transaction.create(
      [
        {
          type: TransactionType.CASH_OUT,
          amount,
          fee,
          fromUser: userId,
          toUser: agentId,
          initiatedBy: userId,
          status: TransactionStatus.COMPLETED,
          meta: { method: "Agent Cash-Out" },
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

// agent wallet status update
const suspendedWallet = async (agentId: string, status: WalletStatus) => {
  const user = await User.findById(agentId).populate(
    "wallet",
    "_id balance status"
  );
  if (!user || user.role !== "AGENT") {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent not found");
  }

  const updateAgent = user.wallet as JwtPayload;

  updateAgent.status = status;
  await updateAgent.save();
  return user;
};

export const AgentService = {
  cashIn,
  cashOut,
  suspendedWallet,
};
