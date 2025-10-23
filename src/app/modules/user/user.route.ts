import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import {
  addOrWithdrewMoneyZodSchema,
  sendMoneyZodSchema,
  userStatusZodSchema,
} from "../wallet/wallet.validation";

export const userRouter = Router();

userRouter.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);

userRouter.get("/users", checkAuth(Role.ADMIN), UserController.getAllUsers);
userRouter.get("/me", checkAuth(...Object.values(Role)), UserController.getMe);

userRouter.patch(
  "/status",
  checkAuth(Role.USER, Role.ADMIN),
  validateRequest(userStatusZodSchema),
  UserController.blockWallet
);

userRouter.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);

userRouter.post(
  "/add-money",
  checkAuth(Role.USER),
  validateRequest(addOrWithdrewMoneyZodSchema),
  UserController.addMoney
);

userRouter.post(
  "/withdraw-money",
  checkAuth(Role.USER),
  validateRequest(addOrWithdrewMoneyZodSchema),
  UserController.withdrawMoney
);

userRouter.post(
  "/send-money",
  checkAuth(Role.USER),
  validateRequest(sendMoneyZodSchema),
  UserController.sendMoney
);

userRouter.get(
  "/:slug",
  checkAuth(...Object.values(Role)),
  UserController.getSingleUser
);
