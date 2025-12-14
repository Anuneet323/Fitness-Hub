import Razorpay from "razorpay";
import crypto from "crypto";

// DO NOT initialize immediately - wait for env vars to load
let razorpayInstance: Razorpay | null = null;
let initializationAttempted = false;
let initializationError: string | null = null;

// Lazy initialization - creates instance on first use
const getRazorpayInstance = (): Razorpay | null => {
  // If already initialized, return cached instance
  if (initializationAttempted) {
    return razorpayInstance;
  }

  // Mark as attempted
  initializationAttempted = true;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  console.log("🔧 Attempting to initialize Razorpay...");
  console.log("   Key ID:", keyId ? `${keyId.substring(0, 12)}...` : "MISSING");
  console.log("   Key Secret:", keySecret ? "Present" : "MISSING");

  if (!keyId || !keySecret) {
    initializationError =
      "Razorpay credentials missing in environment variables";
    console.error("❌", initializationError);
    return null;
  }

  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log("✅ Razorpay instance created successfully");
    return razorpayInstance;
  } catch (error: any) {
    initializationError = error.message || "Failed to initialize Razorpay";
    console.error("❌ Razorpay initialization failed:", error);
    return null;
  }
};

// Export as a getter that initializes on first access
export const getrazorpayInstance = () => getRazorpayInstance();

// For backward compatibility, export direct reference that initializes on first access
Object.defineProperty(exports, "razorpayInstance", {
  get: () => getRazorpayInstance(),
});

// Verify Razorpay configuration
export const verifyRazorpayConfig = (): boolean => {
  try {
    const instance = getRazorpayInstance();

    if (!instance) {
      console.warn("⚠️  Razorpay not configured");
      if (initializationError) {
        console.warn("   Reason:", initializationError);
      }
      return false;
    }

    console.log("✅ Razorpay configured successfully");
    return true;
  } catch (error) {
    console.error("❌ Razorpay configuration check failed:", error);
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
  const instance = getRazorpayInstance();

  if (!instance) {
    const error = initializationError || "Razorpay is not configured";
    throw new Error(error);
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
      notes: notes || {},
      payment_capture: 1,
    };

    console.log("📦 Creating Razorpay order:", {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
    });

    const order = await instance.orders.create(options);

    console.log("✅ Order created:", order.id);

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  } catch (error: any) {
    console.error("❌ Razorpay order creation error:", error);
    throw new Error(error.message || "Failed to create Razorpay order");
  }
};

// Verify Razorpay payment signature
export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new Error("RAZORPAY_KEY_SECRET not found in environment");
    }

    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(text)
      .digest("hex");

    const isValid = expectedSignature === signature;
    console.log(isValid ? "✅ Signature verified" : "❌ Signature invalid");

    return isValid;
  } catch (error) {
    console.error("❌ Signature verification error:", error);
    return false;
  }
};

// Fetch payment details
export const fetchPaymentDetails = async (paymentId: string) => {
  const instance = getRazorpayInstance();

  if (!instance) {
    throw new Error("Razorpay is not configured");
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
    console.error("❌ Error fetching payment details:", error);
    throw error;
  }
};

// Refund payment
export const refundPayment = async (
  paymentId: string,
  amount?: number,
  notes?: Record<string, any>
) => {
  const instance = getRazorpayInstance();

  if (!instance) {
    throw new Error("Razorpay is not configured");
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
    console.error("❌ Refund error:", error);
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
      throw new Error("RAZORPAY_WEBHOOK_SECRET not configured");
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(webhookBody)
      .digest("hex");

    return expectedSignature === webhookSignature;
  } catch (error) {
    console.error("❌ Webhook signature verification error:", error);
    return false;
  }
};

// Create payment link
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
    throw new Error("Razorpay is not configured");
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
      notify: {
        sms: true,
        email: true,
      },
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
    console.error("❌ Payment link creation error:", error);
    throw error;
  }
};
