import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { AdminRouter } from "../modules/admin/admin.route";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
