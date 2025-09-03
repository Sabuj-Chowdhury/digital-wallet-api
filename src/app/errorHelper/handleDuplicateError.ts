/* eslint-disable @typescript-eslint/no-explicit-any */

import { IGenericErrorResponse } from "../interface/error.interface";

export const handleDuplicateError = (err: any): IGenericErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);
  return {
    statusCode: 400,
    message: `${matchedArray[1]} already exist!`,
  };
};
