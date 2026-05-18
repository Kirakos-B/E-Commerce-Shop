import api from "./api";

export const initializePayment = async (
  orderId: string,
): Promise<{ checkoutUrl: string; txRef: string }> => {
  const { data } = await api.post(`/payment/initialize/${orderId}`);
  return { checkoutUrl: data.checkoutUrl, txRef: data.txRef };
};

export const verifyPayment = async (
  txRef: string,
): Promise<{ success: boolean; orderId: string }> => {
  const { data } = await api.get(`/payment/verify/${txRef}`);
  return data;
};
