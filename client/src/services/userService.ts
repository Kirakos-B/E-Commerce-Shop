import api from "./api";
import type { User } from "../types";

interface UpdateProfilePayload {
  name?: string;
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
}

export const getMe = async (): Promise<User> => {
  const { data } = await api.get("/auth/me");
  return data.user;
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<User> => {
  const { data } = await api.put("/auth/me", payload);
  return data.user;
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  await api.put("/auth/password", { currentPassword, newPassword });
};
