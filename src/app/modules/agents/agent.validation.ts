import { z } from "zod";

export const cashInOrOutSchema = z.object({
  userId: z.string(),
  amount: z.number().positive({ message: "Amount must be Positive Number" }),
});
