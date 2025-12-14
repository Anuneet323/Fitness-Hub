// ========================================
// src/config/email.ts
// ========================================
import * as brevo from "@getbrevo/brevo";

// Initialize Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ""
);

// Verify email configuration
export const verifyEmailConfig = (): boolean => {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.error("❌ Brevo API key is missing");
      return false;
    }
    console.log("✅ Email service configured successfully");
    return true;
  } catch (error) {
    console.error("❌ Email configuration failed:", error);
    return false;
  }
};

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Welcome to FitPlanHub! 🎉",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Welcome to FitPlanHub!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining FitPlanHub! We're excited to have you on your fitness journey.</p>
        <p>Start exploring our fitness plans and connect with top trainers today!</p>
        <a href="${process.env.FRONTEND_URL}/explore" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Explore Plans
        </a>
        <p>Best regards,<br>The FitPlanHub Team</p>
      </div>
    `,
  }),

  subscriptionConfirmation: (
    name: string,
    planTitle: string,
    amount: number
  ) => ({
    subject: "Subscription Confirmed! 🎊",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Subscription Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>Your subscription to <strong>${planTitle}</strong> has been confirmed!</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Payment Details</h3>
          <p><strong>Plan:</strong> ${planTitle}</p>
          <p><strong>Amount Paid:</strong> ₹${amount}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/my-subscriptions" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          View My Subscriptions
        </a>
        <p>Best regards,<br>The FitPlanHub Team</p>
      </div>
    `,
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: "Reset Your Password",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Password Reset Request</h1>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>
        <p><small>This link will expire in 30 minutes.</small></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The FitPlanHub Team</p>
      </div>
    `,
  }),

  subscriptionReminder: (
    name: string,
    planTitle: string,
    daysLeft: number
  ) => ({
    subject: `Your subscription expires in ${daysLeft} days`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F59E0B;">Subscription Expiring Soon</h1>
        <p>Hi ${name},</p>
        <p>Your subscription to <strong>${planTitle}</strong> will expire in ${daysLeft} days.</p>
        <p>Renew now to continue your fitness journey without interruption!</p>
        <a href="${process.env.FRONTEND_URL}/renew-subscription" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Renew Subscription
        </a>
        <p>Best regards,<br>The FitPlanHub Team</p>
      </div>
    `,
  }),

  workoutReminder: (name: string) => ({
    subject: "Time for your workout! 💪",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">Workout Reminder</h1>
        <p>Hi ${name},</p>
        <p>Don't forget your workout today! Consistency is key to reaching your fitness goals.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Start Workout
        </a>
        <p>You've got this! 💪</p>
        <p>Best regards,<br>The FitPlanHub Team</p>
      </div>
    `,
  }),
};

// Send email function
export const sendEmail = async (
  to: string[],
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<boolean> => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: process.env.BREVO_SENDER_NAME || "FitPlanHub",
      email: process.env.BREVO_SENDER_EMAIL || "noreply@fitplanhub.com",
    };

    sendSmtpEmail.to = to.map((email) => ({ email }));
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    if (textContent) {
      sendSmtpEmail.textContent = textContent;
    }

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully:", result);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<boolean> => {
  const template = emailTemplates.welcome(name);
  return await sendEmail([email], template.subject, template.htmlContent);
};

// Send subscription confirmation email
export const sendSubscriptionEmail = async (
  email: string,
  name: string,
  planTitle: string,
  amount: number
): Promise<boolean> => {
  const template = emailTemplates.subscriptionConfirmation(
    name,
    planTitle,
    amount
  );
  return await sendEmail([email], template.subject, template.htmlContent);
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetUrl: string
): Promise<boolean> => {
  const template = emailTemplates.passwordReset(name, resetUrl);
  return await sendEmail([email], template.subject, template.htmlContent);
};

// Send subscription reminder email
export const sendSubscriptionReminderEmail = async (
  email: string,
  name: string,
  planTitle: string,
  daysLeft: number
): Promise<boolean> => {
  const template = emailTemplates.subscriptionReminder(
    name,
    planTitle,
    daysLeft
  );
  return await sendEmail([email], template.subject, template.htmlContent);
};

// Send workout reminder email
export const sendWorkoutReminderEmail = async (
  email: string,
  name: string
): Promise<boolean> => {
  const template = emailTemplates.workoutReminder(name);
  return await sendEmail([email], template.subject, template.htmlContent);
};
