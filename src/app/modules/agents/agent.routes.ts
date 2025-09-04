import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { agentStatusSchema, cashInOrOutSchema } from "./agent.validation";
import { Role } from "../user/user.interface";
import { AgentController } from "./agent.controller";

export const agentRouter = Router();

agentRouter.post(
  "/cash-in",
  checkAuth(Role.AGENT),
  validateRequest(cashInOrOutSchema),
  AgentController.cashIn
);

agentRouter.post(
  "/cash-out",
  checkAuth(Role.AGENT),
  validateRequest(cashInOrOutSchema),
  AgentController.cashOut
);

agentRouter.patch(
  "/status",
  checkAuth(Role.ADMIN),
  validateRequest(agentStatusSchema),
  AgentController.suspendedWallet
);
