
// ========================================
// src/services/payment.service.ts
// ========================================
import { 
  createRazorpayOrder, 
  verifyRazorpaySignature, 
  fetchPaymentDetails,
  refundPayment 
} from '../config/razorpay';
import { Payment } from '../models/Payment.model';

export const paymentService = {
  createOrder: async (
    userId: string,
    planId: string,
    amount: number,
    currency: string = 'INR'
  ) => {
    const receipt = `rcpt_${Date.now()}`;
    const order = await createRazorpayOrder(amount, currency, receipt, {
      userId,
      planId
    });

    const payment = await Payment.create({
      userId,
      planId,
      razorpayOrderId: order.orderId,
      amount,
      currency,
      status: 'created',
      receipt
    });

    return { order, payment };
  },

  verifyPayment: async (
    orderId: string,
    paymentId: string,
    signature: string
  ) => {
    const isValid = verifyRazorpaySignature(orderId, paymentId, signature);
    
    if (isValid) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: orderId },
        {
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          status: 'success',
          paymentStatus: 'paid'
        }
      );
    }

    return isValid;
  },

  getPaymentDetails: async (paymentId: string) => {
    return await fetchPaymentDetails(paymentId);
  },

  processRefund: async (paymentId: string, amount?: number) => {
    return await refundPayment(paymentId, amount);
  }
};
