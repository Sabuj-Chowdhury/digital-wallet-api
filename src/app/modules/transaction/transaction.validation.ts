import z from "zod";
import { TransactionStatus, TransactionType } from "./transaction.interface";

export const createTransactionValidation = z.object({
  type: z.enum(Object.values(TransactionType) as [string]),
  amount: z
    .number({ error: "Amount is required" })
    .positive("Amount must be Positive Number"),
  fee: z.number().min(0).default(0),
  status: z
    .enum(Object.values(TransactionStatus) as [string])
    .default(TransactionStatus.COMPLETED),
});
