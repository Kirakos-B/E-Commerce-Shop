import api from "./api";
import type { Order } from "../types";

interface CreateOrderPayload {
  items: { product: string; quantity: number }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  paymentMethod: string;
  notes?: string;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<Order> => {
  const { data } = await api.post("/orders", payload);
  return data.order;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const { data } = await api.get("/orders/my");
  return data.orders;
};

export const getOrder = async (id: string): Promise<Order> => {
  const { data } = await api.get(`/orders/${id}`);
  return data.order;
};

export const cancelOrder = async (id: string): Promise<Order> => {
  const { data } = await api.put(`/orders/${id}/cancel`);
  return data.order;
};
