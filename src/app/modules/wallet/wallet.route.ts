import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { WalletController } from "./wallet.controller";

export const walletRouter = Router();

walletRouter.get(
  "/:slug",
  checkAuth(Role.AGENT, Role.USER),
  WalletController.getMyWallet
);

walletRouter.get("/", checkAuth(Role.ADMIN), WalletController.getAllWallets);
