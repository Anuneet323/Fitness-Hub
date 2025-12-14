// ========================================
// src/config/razorpay.ts
// ========================================
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance only if credentials are provided
let razorpayInstance: Razorpay | null = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export { razorpayInstance };

// Verify Razorpay configuration
export const verifyRazorpayConfig = (): boolean => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn(
        "⚠️  Razorpay credentials not configured (payment features disabled)"
      );
      return false;
    }
    console.log("✅ Razorpay configured successfully");
    return true;
  } catch (error) {
    console.error("❌ Razorpay configuration failed:", error);
    return false;
  }
};

// Create Razorpay order
export const createRazorpayOrder = async (
  amount: number,
  currency: string = "INR",
  receipt: string,
  notes?: Record<string, any>
) => {
  try {
    if (!razorpayInstance) {
      throw new Error(
        "Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env"
      );
    }

    const options = {
      amount: amount * 100, // Amount in paise (₹100 = 10000 paise)
      currency,
      receipt,
      notes: notes || {},
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpayInstance.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    throw error;
  }
};

// Verify Razorpay payment signature
export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(text)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
};

// Fetch payment details
export const fetchPaymentDetails = async (paymentId: string) => {
  try {
    if (!razorpayInstance) {
      throw new Error("Razorpay is not configured");
    }

    const payment = await razorpayInstance.payments.fetch(paymentId);

    const amountInRupees =
      typeof payment.amount === "number" ? payment.amount / 100 : 0;

    return {
      id: payment.id,
      amount: amountInRupees,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      createdAt: new Date(payment.created_at * 1000),
    };
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
};

// Refund payment
export const refundPayment = async (
  paymentId: string,
  amount?: number,
  notes?: Record<string, any>
) => {
  try {
    if (!razorpayInstance) {
      throw new Error("Razorpay is not configured");
    }

    const refundData: any = { payment_id: paymentId };
    if (amount) refundData.amount = amount * 100;
    if (notes) refundData.notes = notes;

    const refund = await razorpayInstance.payments.refund(
      paymentId,
      refundData
    );

    const refundAmountInRupees =
      refund.amount && typeof refund.amount === "number"
        ? refund.amount / 100
        : 0;

    return {
      refundId: refund.id,
      paymentId: refund.payment_id,
      amount: refundAmountInRupees,
      status: refund.status,
    };
  } catch (error) {
    console.error("Refund error:", error);
    throw error;
  }
};

// Verify webhook signature
export const verifyWebhookSignature = (
  webhookBody: string,
  webhookSignature: string
): boolean => {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
      .update(webhookBody)
      .digest("hex");

    return expectedSignature === webhookSignature;
  } catch (error) {
    console.error("Webhook signature verification error:", error);
    return false;
  }
};

// Get payment link
export const createPaymentLink = async (
  amount: number,
  description: string,
  customerName: string,
  customerEmail: string,
  customerContact: string,
  callbackUrl?: string
) => {
  try {
    if (!razorpayInstance) {
      throw new Error("Razorpay is not configured");
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      description,
      customer: {
        name: customerName,
        email: customerEmail,
        contact: customerContact,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: callbackUrl || process.env.PAYMENT_SUCCESS_URL,
      callback_method: "get",
    };

    const paymentLink = await razorpayInstance.paymentLink.create(options);

    const amountInRupees =
      typeof paymentLink.amount === "number" ? paymentLink.amount / 100 : 0;

    return {
      id: paymentLink.id,
      shortUrl: paymentLink.short_url,
      amount: amountInRupees,
      description: paymentLink.description,
    };
  } catch (error) {
    console.error("Payment link creation error:", error);
    throw error;
  }
};
