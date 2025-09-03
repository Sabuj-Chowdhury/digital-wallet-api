import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { AdminController } from "./admin.controller";
import { Role } from "../user/user.interface";

export const AdminRouter = Router();

AdminRouter.get("/users", checkAuth(Role.ADMIN), AdminController.getAllUsers);
