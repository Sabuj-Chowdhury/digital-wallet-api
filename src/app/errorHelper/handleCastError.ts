/* eslint-disable @typescript-eslint/no-unused-vars */

import mongoose from "mongoose";
import { IGenericErrorResponse } from "../interface/error.interface";

export const handleCastError = (
  err: mongoose.Error.CastError
): IGenericErrorResponse => {
  return {
    statusCode: 400,
    message: `Invalid mongoose ObjectID, please provide a valid ObjectID!`,
  };
};
