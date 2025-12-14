// Email service wrapper
import {
  sendWelcomeEmail,
  sendSubscriptionEmail,
  sendPasswordResetEmail,
  sendSubscriptionReminderEmail,
} from "../config/email";

export const emailService = {
  sendWelcome: async (email: string, name: string) => {
    return await sendWelcomeEmail(email, name);
  },

  sendSubscriptionConfirmation: async (
    email: string,
    name: string,
    planTitle: string,
    amount: number
  ) => {
    return await sendSubscriptionEmail(email, name, planTitle, amount);
  },

  sendPasswordReset: async (email: string, name: string, resetUrl: string) => {
    return await sendPasswordResetEmail(email, name, resetUrl);
  },

  sendSubscriptionReminder: async (
    email: string,
    name: string,
    planTitle: string,
    daysLeft: number
  ) => {
    return await sendSubscriptionReminderEmail(
      email,
      name,
      planTitle,
      daysLeft
    );
  },
};
