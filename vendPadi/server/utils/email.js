const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'VendPadi <noreply@vendpadi.com>';

const sendPasswordResetEmail = async (email, resetToken, businessName) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset your VendPadi password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #25C675 0%, #1BA85E 100%); padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">VendPadi</h1>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 20px;">Password Reset Request</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 24px;">
                Hi ${businessName || 'there'},<br><br>
                We received a request to reset your VendPadi password. Click the button below to create a new password.
              </p>
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #25C675 0%, #1BA85E 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 16px; margin-bottom: 24px;">
                Reset Password
              </a>
              <p style="color: #999; font-size: 14px; line-height: 1.5;">
                This link expires in <strong>30 minutes</strong>.<br>
                If you didn't request a password reset, you can safely ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                VendPadi - Your WhatsApp Store Builder<br>
                <a href="${process.env.CLIENT_URL}" style="color: #25C675;">vendpadi.com</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, error: err.message };
  }
};

module.exports = { sendPasswordResetEmail };
