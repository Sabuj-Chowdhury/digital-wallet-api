import z from "zod";
import { WalletStatus } from "./wallet.interface";

export const addOrWithdrewMoneyZodSchema = z.object({
  amount: z
    .number()
    .min(0)
    .int()
    .positive({ message: "Balance must be positive Number" }),
});

export const sendMoneyZodSchema = z.object({
  receiverId: z.string(),
  amount: z
    .number()
    .min(0)
    .int()
    .positive({ message: "Balance must be positive Number" }),
});

export const createWalletZodSchema = z.object({
  user: z.string(),
  balance: z
    .number()
    .min(0)
    .int()
    .positive({ message: "Balance must be positive Number" }),
});

export const updateWalletZodSchema = z.object({
  status: z.enum(Object.values(WalletStatus) as [string]),
});

export const userStatusZodSchema = z.object({
  userId: z.string(),
  status: z.enum(Object.values(WalletStatus) as [string]),
});
