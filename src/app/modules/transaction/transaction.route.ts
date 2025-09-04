import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";

export const transactionRouter = Router();

transactionRouter.get(
  "/all-transactions",
  checkAuth(Role.ADMIN),
  TransactionController.getAllTransactions
);

transactionRouter.get(
  "/:slug",
  checkAuth(...Object.values(Role)),
  TransactionController.getMyTransactions
);
