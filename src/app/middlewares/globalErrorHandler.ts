/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { envVariable } from "../config/enVariable";
import { IErrorSources } from "../interface/error.interface";
import { handleDuplicateError } from "../errorHelper/handleDuplicateError";
import { handleCastError } from "../errorHelper/handleCastError";
import { handleValidationError } from "../errorHelper/handleValidationError";
import { handleZodError } from "../errorHelper/handleZodError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong!";

  let errorSource: IErrorSources[] = [];

  // duplicate email -mongoose error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // ObjectID error / cast error -> mongoose
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // validation error ->mongoose
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSource = simplifiedError.errorSource as IErrorSources[];
    message = simplifiedError.message;
  }
  // zod error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSource as IErrorSources[];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err: envVariable.NODE_ENV === "development" ? err : null,
    stack: envVariable.NODE_ENV === "development" ? err.stack : null,
  });
};
