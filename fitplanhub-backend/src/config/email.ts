// Email setup with Brevo
import * as brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ""
);

export const verifyEmailConfig = (): boolean => {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.error("Brevo API key missing");
      return false;
    }
    console.log("Email service ready");
    return true;
  } catch (error) {
    console.error("Email config failed:", error);
    return false;
  }
};

export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Welcome",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Welcome!</h1>
        <p>Hi ${name},</p>
        <p>Thanks for joining. Get started today.</p>
        <a href="${process.env.FRONTEND_URL}/explore" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">
          Get Started
        </a>
        <p>Best,<br>Team</p>
      </div>
    `,
  }),

  subscriptionConfirmation: (
    name: string,
    planTitle: string,
    amount: number
  ) => ({
    subject: "Subscription Confirmed",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Subscription Active</h1>
        <p>Hi ${name},</p>
        <p>Your ${planTitle} subscription is confirmed.</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Plan:</strong> ${planTitle}</p>
          <p><strong>Amount:</strong> ₹${amount}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/my-subscriptions" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">
          View Subscription
        </a>
        <p>Best,<br>Team</p>
      </div>
    `,
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: "Reset Your Password",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Password Reset</h1>
        <p>Hi ${name},</p>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">
          Reset Password
        </a>
        <p><small>Link expires in 30 minutes.</small></p>
        <p>Best,<br>Team</p>
      </div>
    `,
  }),

  subscriptionReminder: (
    name: string,
    planTitle: string,
    daysLeft: number
  ) => ({
    subject: `Subscription expires in ${daysLeft} days`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F59E0B;">Subscription Reminder</h1>
        <p>Hi ${name},</p>
        <p>Your ${planTitle} subscription expires in ${daysLeft} days.</p>
        <a href="${process.env.FRONTEND_URL}/renew-subscription" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">
          Renew Now
        </a>
        <p>Best,<br>Team</p>
      </div>
    `,
  }),
};

export const sendEmail = async (
  to: string[],
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<boolean> => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: process.env.BREVO_SENDER_NAME || "App",
      email: process.env.BREVO_SENDER_EMAIL || "noreply@domain.com",
    };
    sendSmtpEmail.to = to.map((email) => ({ email }));
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    if (textContent) {
      sendSmtpEmail.textContent = textContent;
    }

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent to:", to[0]);
    return true;
  } catch (error) {
    console.error("Email failed:", error);
    return false;
  }
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<boolean> => {
  const template = emailTemplates.welcome(name);
  return await sendEmail([email], template.subject, template.htmlContent);
};

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

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetUrl: string
): Promise<boolean> => {
  const template = emailTemplates.passwordReset(name, resetUrl);
  return await sendEmail([email], template.subject, template.htmlContent);
};

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
