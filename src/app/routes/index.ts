import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { authRouter } from "../modules/auth/auth.route";
import { transactionRouter } from "../modules/transaction/transaction.route";
import { walletRouter } from "../modules/wallet/wallet.route";
import { agentRouter } from "../modules/agents/agent.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/transaction",
    route: transactionRouter,
  },
  {
    path: "/wallet",
    route: walletRouter,
  },
  {
    path: "/agent",
    route: agentRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
