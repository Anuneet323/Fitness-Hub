export const generateEmailTemplate = (
  title: string,
  content: string,
  buttonText?: string,
  buttonUrl?: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="content">
          ${content}
          ${
            buttonText && buttonUrl
              ? `
            <div style="text-align: center;">
              <a href="${buttonUrl}" class="button">${buttonText}</a>
            </div>
          `
              : ""
          }
        </div>
        <div class="footer">
          <p>© 2025 FitPlanHub. All rights reserved.</p>
          <p>If you have questions, contact us at support@fitplanhub.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
