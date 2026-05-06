import { Request } from "express";
import { Document, Types } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  sizes?: {
    chest?: number;
    waist?: number;
    hips?: number;
    shoulder?: number;
    inseam?: number;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface AuthRequest extends Request {
  user?: IUser;
}
