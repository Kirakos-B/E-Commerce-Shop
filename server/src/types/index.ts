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

export type ProductCategory =
  | "suits"
  | "shirts"
  | "trousers"
  | "dresses"
  | "jackets"
  | "traditional"
  | "accessories"
  | "other";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type PaymentMethod = "cash" | "card" | "transfer";

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user?: Types.ObjectId; // optional — guest checkout
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  items: IOrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  totalPrice: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FabricType =
  | "cotton"
  | "silk"
  | "wool"
  | "linen"
  | "polyester"
  | "blend"
  | "other";

export type CustomOrderStatus =
  | "pending"
  | "reviewing"
  | "approved"
  | "in_progress"
  | "ready"
  | "delivered"
  | "cancelled";

export interface ICustomOrder extends Document {
  _id: Types.ObjectId;
  user?: Types.ObjectId;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  designDescription: string;
  fabric: FabricType;
  color: string;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    shoulder?: number;
    inseam?: number;
    height?: number;
    weight?: number;
    notes?: string;
  };
  referenceImages: string[];
  estimatedPrice?: number;
  finalPrice?: number;
  status: CustomOrderStatus;
  adminNotes?: string;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
