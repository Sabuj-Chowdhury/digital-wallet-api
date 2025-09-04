/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema } from "mongoose";

export enum TransactionType {
  ADD_MONEY = "ADD_MONEY",
  SEND_MONEY = "SEND_MONEY",
  WITHDRAW = "WITHDRAW",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
}

export enum TransactionStatus {
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REVERSE = "REVERSE",
}

export interface ITransaction {
  type: TransactionType;
  amount: number;
  fee?: number;
  fromUser?: Schema.Types.ObjectId | null;
  toUser?: Schema.Types.ObjectId | null;
  initiatedBy: Schema.Types.ObjectId;
  status: TransactionStatus;
  meta?: Record<string, any>;
}
