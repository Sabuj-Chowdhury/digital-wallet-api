/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  IErrorSources,
  IGenericErrorResponse,
} from "../interface/error.interface";

export const handleZodError = (err: any): IGenericErrorResponse => {
  const errorSource: IErrorSources[] = [];
  err.issues.forEach((issue: any) => {
    errorSource.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });
  return {
    statusCode: 400,
    message: "Zod error",
    errorSource,
  };
};
