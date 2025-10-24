import z from "zod";
import { WalletStatus } from "./wallet.interface";

export const addOrWithdrewMoneyZodSchema = z.object({
  amount: z
    .number()
    .min(0)
    .int()
    .positive({ message: "Balance must be positive Number" }),
});

export const WithdrewMoneyZodSchema = z.object({
  agentPhone: z
    .string({ error: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),

  amount: z
    .number()
    .min(0)
    .int()
    .positive({ message: "Balance must be positive Number" }),
});

export const sendMoneyZodSchema = z.object({
  receiverId: z.string().optional(),
  receiverPhone: z
    .string({ error: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
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
