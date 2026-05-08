import api from "./api";
import type { Feedback } from "../types";

interface CreateFeedbackPayload {
  product?: string;
  order?: string;
  rating: number;
  comment: string;
}

export const createFeedback = async (
  payload: CreateFeedbackPayload,
): Promise<Feedback> => {
  const { data } = await api.post("/feedback", payload);
  return data.feedback;
};

export const getProductFeedback = async (
  productId: string,
): Promise<Feedback[]> => {
  const { data } = await api.get(`/feedback/product/${productId}`);
  return data.feedback;
};

export const deleteFeedback = async (id: string): Promise<void> => {
  await api.delete(`/feedback/${id}`);
};
