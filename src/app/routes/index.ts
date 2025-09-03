import { Router } from "express";
import { userRouter } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
