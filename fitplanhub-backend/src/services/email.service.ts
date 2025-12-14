
// ========================================
// src/services/email.service.ts
// ========================================
import { 
  sendWelcomeEmail, 
  sendSubscriptionEmail, 
  sendPasswordResetEmail,
  sendSubscriptionReminderEmail,
  sendWorkoutReminderEmail
} from '../config/email';

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
    return await sendSubscriptionReminderEmail(email, name, planTitle, daysLeft);
  },

  sendWorkoutReminder: async (email: string, name: string) => {
    return await sendWorkoutReminderEmail(email, name);
  }
};
