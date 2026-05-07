export type UserRole = "user" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: Address;
  sizes?: Sizes;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface Sizes {
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  inseam?: number;
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

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  stock: number;
  ratings: { average: number; count: number };
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user?: string;
  guestInfo?: { name: string; email: string; phone: string };
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalPrice: number;
  notes?: string;
  createdAt: string;
}

export interface CustomOrder {
  _id: string;
  user?: string;
  guestInfo?: { name: string; email: string; phone: string };
  designDescription: string;
  fabric: string;
  color: string;
  measurements: Record<string, number | string>;
  referenceImages: string[];
  estimatedPrice?: number;
  finalPrice?: number;
  status: string;
  adminNotes?: string;
  deliveryDate?: string;
  createdAt: string;
}

export interface Feedback {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  product?: string;
  order?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  caption: string;
  images: string[];
  likes: string[];
  isApproved: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
