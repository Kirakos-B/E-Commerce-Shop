import api from "./api";
import type { CustomOrder } from "../types";

interface CreateCustomOrderPayload {
  designDescription: string;
  fabric: string;
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
  referenceImages?: string[];
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export const createCustomOrder = async (
  payload: CreateCustomOrderPayload,
): Promise<CustomOrder> => {
  const { data } = await api.post("/custom-orders", payload);
  return data.customOrder;
};

export const getMyCustomOrders = async (): Promise<CustomOrder[]> => {
  const { data } = await api.get("/custom-orders/my");
  return data.orders;
};

export const getCustomOrder = async (id: string): Promise<CustomOrder> => {
  const { data } = await api.get(`/custom-orders/${id}`);
  return data.order;
};
