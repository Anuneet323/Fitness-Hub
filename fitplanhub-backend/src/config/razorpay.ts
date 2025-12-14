// Razorpay payment setup
import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayInstance: Razorpay | null = null;
let initializationAttempted = false;
let initializationError: string | null = null;

const getRazorpayInstance = (): Razorpay | null => {
  if (initializationAttempted) {
    return razorpayInstance;
  }

  initializationAttempted = true;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  console.log("Setting up Razorpay");
  console.log("Key ID:", keyId ? `${keyId.substring(0, 12)}...` : "MISSING");
  console.log("Key Secret:", keySecret ? "Present" : "MISSING");

  if (!keyId || !keySecret) {
    initializationError = "Razorpay credentials missing";
    console.error("Razorpay keys missing");
    return null;
  }

  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log("Razorpay ready");
    return razorpayInstance;
  } catch (error: any) {
    initializationError = error.message;
    console.error("Razorpay init failed:", error.message);
    return null;
  }
};

export const getrazorpayInstance = () => getRazorpayInstance();

Object.defineProperty(exports, "razorpayInstance", {
  get: () => getRazorpayInstance(),
});

export const verifyRazorpayConfig = (): boolean => {
  try {
    const instance = getRazorpayInstance();
    if (!instance) {
      console.warn("Razorpay not configured");
      return false;
    }
    console.log("Razorpay config OK");
    return true;
  } catch (error) {
    console.error("Razorpay check failed:", error);
    return false;
  }
};

// Create order for checkout
export const createRazorpayOrder = async (
  amount: number,
  currency: string = "INR",
  receipt: string,
  notes?: Record<string, any>
) => {
  const instance = getRazorpayInstance();
  if (!instance) {
    throw new Error(initializationError || "Razorpay not configured");
  }

  try {
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt,
      notes: notes || {},
      payment_capture: 1,
    };

    console.log("Creating order:", options.amount, options.currency);
    const order = await instance.orders.create(options);
    console.log("Order created:", order.id);

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  } catch (error: any) {
    console.error("Order creation failed:", error.message);
    throw new Error(error.message || "Order creation failed");
  }
};

// Verify payment signature from frontend
export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      throw new Error("RAZORPAY_KEY_SECRET missing");
    }

    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(text)
      .digest("hex");

    const isValid = expectedSignature === signature;
    console.log("Signature check:", isValid ? "OK" : "FAILED");
    return isValid;
  } catch (error) {
    console.error("Signature verify error:", error);
    return false;
  }
};

// Get payment details
export const fetchPaymentDetails = async (paymentId: string) => {
  const instance = getRazorpayInstance();
  if (!instance) {
    throw new Error("Razorpay not configured");
  }

  try {
    const payment = await instance.payments.fetch(paymentId);
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
    console.error("Payment fetch failed:", error);
    throw error;
  }
};

// Process refund
export const refundPayment = async (
  paymentId: string,
  amount?: number,
  notes?: Record<string, any>
) => {
  const instance = getRazorpayInstance();
  if (!instance) {
    throw new Error("Razorpay not configured");
  }

  try {
    const refundData: any = { payment_id: paymentId };
    if (amount) refundData.amount = amount * 100;
    if (notes) refundData.notes = notes;

    const refund = await instance.payments.refund(paymentId, refundData);
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
    console.error("Refund failed:", error);
    throw error;
  }
};

// Verify webhook signature
export const verifyWebhookSignature = (
  webhookBody: string,
  webhookSignature: string
): boolean => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("RAZORPAY_WEBHOOK_SECRET missing");
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(webhookBody)
      .digest("hex");

    return expectedSignature === webhookSignature;
  } catch (error) {
    console.error("Webhook verify failed:", error);
    return false;
  }
};

// Generate payment link
export const createPaymentLink = async (
  amount: number,
  description: string,
  customerName: string,
  customerEmail: string,
  customerContact: string,
  callbackUrl?: string
) => {
  const instance = getRazorpayInstance();
  if (!instance) {
    throw new Error("Razorpay not configured");
  }

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      description,
      customer: {
        name: customerName,
        email: customerEmail,
        contact: customerContact,
      },
      notify: { sms: true, email: true },
      reminder_enable: true,
      callback_url: callbackUrl || process.env.PAYMENT_SUCCESS_URL,
      callback_method: "get",
    };

    const paymentLink = await instance.paymentLink.create(options);
    const amountInRupees =
      typeof paymentLink.amount === "number" ? paymentLink.amount / 100 : 0;

    return {
      id: paymentLink.id,
      shortUrl: paymentLink.short_url,
      amount: amountInRupees,
      description: paymentLink.description,
    };
  } catch (error) {
    console.error("Payment link failed:", error);
    throw error;
  }
};
