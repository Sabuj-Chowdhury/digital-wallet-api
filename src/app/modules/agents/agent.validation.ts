import { z } from "zod";
import { WalletStatus } from "../wallet/wallet.interface";

export const agentCashInZodSchema = z.object({
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

export const agentStatusSchema = z.object({
  agentId: z.string(),
  status: z.enum(Object.values(WalletStatus) as [string]),
});
