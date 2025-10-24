import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  phone: string;
  email?: string;
  password?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  role?: Role;
  wallet?: Types.ObjectId;
}

export interface SendMoneyPayload {
  receiverId?: string;
  receiverPhone?: string;
  amount: number;
}

export interface WithdrawMoneyPayload {
  agentPhone: string;
  amount: number;
}
