import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { addOrWithdrewMoneyZodSchema } from "../wallet/wallet.validation";

export const userRouter = Router();

userRouter.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);

userRouter.get("/users", checkAuth(Role.ADMIN), UserController.getAllUsers);

userRouter.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);

userRouter.get(
  "/:slug",
  checkAuth(...Object.values(Role)),
  UserController.getSingleUser
);

// ---------------user Wallet Route-----------

userRouter.post(
  "/add-money",
  checkAuth(Role.USER),
  validateRequest(addOrWithdrewMoneyZodSchema),
  UserController.addMoney
);
