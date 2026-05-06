import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ||
  "7d") as SignOptions["expiresIn"];

// Generate JWT token
export const generateToken = (id: Types.ObjectId): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign({ id: id.toString() }, JWT_SECRET, options);
};

// Send token as httpOnly cookie + response
export const sendTokenResponse = (
  userId: Types.ObjectId,
  statusCode: number,
  res: Response,
  data: object,
): void => {
  const token = generateToken(userId);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      token,
      ...data,
    });
};
