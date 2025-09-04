import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { authRouter } from "../modules/auth/auth.route";
import { transactionRouter } from "../modules/transaction/transaction.route";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
