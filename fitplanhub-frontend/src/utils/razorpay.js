// src/utils/razorpay.js
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initializeRazorpay = (options) => {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Razorpay SDK not loaded"));
      return;
    }

    const razorpay = new window.Razorpay({
      ...options,
      modal: {
        ondismiss: function () {
          reject(new Error("Payment cancelled by user"));
        },
      },
      handler: function (response) {
        resolve(response);
      },
    });

    razorpay.open();
  });
};
