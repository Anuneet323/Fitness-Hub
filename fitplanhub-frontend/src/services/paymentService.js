// ============================================
// src/services/paymentService.js - Payments
// ============================================

import api from "./api";

export const paymentService = {
  // Create order
  createOrder: async (orderData) => {
    const response = await api.post("/payments/create-order", orderData);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post("/payments/verify", paymentData);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async () => {
    const response = await api.get("/payments/history");
    return response.data;
  },
};
