import { NextFunction, Request, Response } from "express";
import { envVariable } from "../config/enVariable";

type fnType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const tryCatch =
  (fn: fnType) => (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      if (envVariable.NODE_ENV === "development") {
        console.log(err);
      }

      next(err);
    });
  };

export default tryCatch;
