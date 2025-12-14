// Razorpay utility functions
import crypto from "crypto";

export const generateReceipt = (prefix: string = "rcpt"): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatAmount = (amount: number): number => {
  return Math.round(amount * 100); // paise
};

export const parseAmount = (amountInPaise: number): number => {
  return amountInPaise / 100; // rupees
};

export const createHmacSignature = (data: string, secret: string): string => {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
};

export const verifySignature = (
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean => {
  const expectedSignature = createHmacSignature(
    `${orderId}|${paymentId}`,
    secret
  );
  return expectedSignature === signature;
};
