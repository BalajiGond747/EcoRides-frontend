import api from "./api";

export const createPaymentOrder = async (bookingId) => {
  const response = await api.post(`/payments/create-order/${bookingId}`);
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post("/payments/verify", paymentData);
  return response.data;
};

export const getAllPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};