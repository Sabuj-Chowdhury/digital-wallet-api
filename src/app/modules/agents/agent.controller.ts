/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import tryCatch from "../../utils/tryCatch";
import { AgentService } from "./agent.service";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelper/AppError";

const cashIn = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;
    const agentId = decodeToken.userId;

    const { userId, amount } = req.body;
    const wallet = await AgentService.cashIn(agentId, userId, amount);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Cash-in successful",
      data: wallet,
    });
  }
);

const cashOut = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;
    const agentId = decodeToken.userId;
    const { userId, amount } = req.body;
    const wallet = await AgentService.cashOut(agentId, userId, amount);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cash-out successful",
      data: wallet,
    });
  }
);

// agent wallet update
const suspendedWallet = tryCatch(async (req: Request, res: Response) => {
  const { agentId, status } = req.body;

  if (status === "ACTIVE" || status === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The Agent will only be APPROVED or SUSPENDED"
    );
  }

  const agent = await AgentService.suspendedWallet(agentId, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent Wallet status updated",
    data: agent,
  });
});

const getAllAgents = tryCatch(async (req: Request, res: Response) => {
  const agents = await AgentService.getAllAgents();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agents retrieved Successfully",
    data: agents,
  });
});

export const AgentController = {
  cashIn,
  cashOut,
  suspendedWallet,
  getAllAgents,
};
