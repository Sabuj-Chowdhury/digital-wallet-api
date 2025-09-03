import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { UserController } from "./user.controller";

export const userRouter = Router();

userRouter.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
