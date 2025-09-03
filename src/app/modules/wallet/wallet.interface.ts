import { Types } from "mongoose";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
}

export interface IWallet {
  user: Types.ObjectId;
  balance: number;
  status: WalletStatus;
}
