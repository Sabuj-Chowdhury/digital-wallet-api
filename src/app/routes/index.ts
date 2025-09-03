import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { AdminRouter } from "../modules/admin/admin.route";
import { authRouter } from "../modules/auth/auth.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/admin",
    route: AdminRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
