import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

export const authRouter = Router();

authRouter.post("/login", AuthControllers.credentialsLogin);
authRouter.post("/logout", AuthControllers.logout);
authRouter.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);
authRouter.post("/refresh-token", AuthControllers.getNewAccessToken);
