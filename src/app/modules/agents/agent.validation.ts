import { z } from "zod";
import { WalletStatus } from "../wallet/wallet.interface";

export const cashInOrOutSchema = z.object({
  userId: z.string(),
  amount: z.number().positive({ message: "Amount must be Positive Number" }),
});

export const agentStatusSchema = z.object({
  agentId: z.string(),
  status: z.enum(Object.values(WalletStatus) as [string]),
});
