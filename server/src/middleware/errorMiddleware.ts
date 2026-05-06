import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errorHandler";

const errorMiddleware = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = (err as AppError).statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;
