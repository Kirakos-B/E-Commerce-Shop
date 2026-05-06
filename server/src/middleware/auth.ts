import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AppError } from "../utils/errorHandler";
import { AuthRequest } from "../types";

interface JwtPayload {
  id: string;
}

// Protect — must be logged in
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Or check cookie
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError("Not authorized, no token", 401));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    req.user = user;
    next();
  } catch {
    next(new AppError("Not authorized, token failed", 401));
  }
};

// Restrict to admin only
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "admin") {
    return next(new AppError("Access denied: Admins only", 403));
  }
  next();
};
