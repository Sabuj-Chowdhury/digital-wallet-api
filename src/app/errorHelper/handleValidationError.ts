/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import {
  IErrorSources,
  IGenericErrorResponse,
} from "../interface/error.interface";

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errorSource: IErrorSources[] = [];

  const errors = Object.values(err.errors);

  errors.forEach((errorObject: any) =>
    errorSource.push({
      path: errorObject.path,
      message: errorObject.message,
    })
  );

  return {
    statusCode: 400,
    message: "Validation error!",
    errorSource,
  };
};
