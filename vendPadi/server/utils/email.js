const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'VendPadi <noreply@resend.dev>';

const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
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

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 20px;
`;

const cardStyles = `
  max-width: 520px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

const headerStyles = `
  background: linear-gradient(135deg, #25C675 0%, #1BA85E 100%);
  padding: 32px;
  text-align: center;
`;

const contentStyles = `
  padding: 32px;
`;

const footerStyles = `
  padding: 24px 32px;
  background: #f8f9fa;
  text-align: center;
  border-top: 1px solid #eee;
`;

const buttonStyles = `
  display: inline-block;
  background: linear-gradient(135deg, #25C675 0%, #1BA85E 100%);
  color: white;
  text-decoration: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
`;

const secondaryButtonStyles = `
  display: inline-block;
  background: #1a1a2e;
  color: white;
  text-decoration: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
`;

exports.sendWelcomeEmail = async (email, businessName) => {
  const loginUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/login` : 'http://localhost:5173/login';
  const storeUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/store/${businessName?.toLowerCase().replace(/\s+/g, '-')}` : '#';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="${headerStyles}">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎉 Welcome to VendPadi!</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Hi ${businessName || 'there'}! 👋
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            Congratulations on joining VendPadi! Your WhatsApp-powered store is ready to go.
          </p>
          
          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">Here's what you can do:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
              <li>Add your products with photos</li>
              <li>Customize your store design</li>
              <li>Share your store link on WhatsApp</li>
              <li>Receive orders directly from customers</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${loginUrl}" style="${buttonStyles}">
              Go to Your Dashboard
            </a>
          </div>

          <p style="color: #999; font-size: 14px; line-height: 1.6;">
            Your store link: <a href="${storeUrl}" style="color: #25C675;">${storeUrl}</a>
          </p>
        </div>
        <div style="${footerStyles}">
          <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
            <strong>VendPadi</strong> - Build your WhatsApp store in minutes
          </p>
          <p style="color: #999; margin: 0; font-size: 12px;">
            <a href="${process.env.CLIENT_URL || '#'}" style="color: #25C675;">vendpadi.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Welcome to VendPadi, ${businessName}! 🎉`,
    html,
  });
};

exports.sendPasswordResetEmail = async (email, resetToken, businessName) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="${headerStyles}">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Reset Your Password</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Hi ${businessName || 'there'}! 👋
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 24px;">
            We received a request to reset your VendPadi password. Click the button below to create a new password.
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}" style="${buttonStyles}">
              Reset Password 🔑
            </a>
          </div>

          <div style="background: #fff3cd; border-radius: 12px; padding: 16px; margin: 24px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              ⏰ This link expires in <strong>30 minutes</strong>. If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </div>
        </div>
        <div style="${footerStyles}">
          <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
            <strong>VendPadi</strong> - Build your WhatsApp store in minutes
          </p>
          <p style="color: #999; margin: 0; font-size: 12px;">
            <a href="${process.env.CLIENT_URL || '#'}" style="color: #25C675;">vendpadi.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your VendPadi password',
    html,
  });
};

exports.sendPlanUpgradeEmail = async (email, businessName, planName, planFeatures) => {
  const dashboardUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/dashboard` : 'http://localhost:5173/dashboard';

  const featuresList = planFeatures
    .map(f => `<li style="color: #666; margin-bottom: 8px;">✓ ${f}</li>`)
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="${headerStyles}">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎊 Plan Upgraded!</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Congratulations, ${businessName}! 🎉
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 24px;">
            Your VendPadi plan has been upgraded to <strong style="color: #25C675;">${planName}</strong>. You now have access to premium features!
          </p>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px; color: #1a1a2e; font-size: 16px;">Your New Features:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${featuresList}
            </ul>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${dashboardUrl}" style="${buttonStyles}">
              Start Using Premium 🚀
            </a>
          </div>
        </div>
        <div style="${footerStyles}">
          <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
            <strong>VendPadi</strong> - Build your WhatsApp store in minutes
          </p>
          <p style="color: #999; margin: 0; font-size: 12px;">
            <a href="${process.env.CLIENT_URL || '#'}" style="color: #25C675;">vendpadi.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `🎉 Your VendPadi plan is now ${planName}!`,
    html,
  });
};

exports.sendGreetingEmail = async (email, businessName, greetingType = 'general') => {
  const greetings = {
    newYear: {
      emoji: '🎊',
      title: 'Happy New Year!',
      message: 'Wishing you an amazing year of growth and success for your business!',
    },
    holiday: {
      emoji: '🎄',
      title: 'Season\'s Greetings!',
      message: 'Thank you for being part of the VendPadi family. Wishing you joyful holidays!',
    },
    milestone: {
      emoji: '🏆',
      title: 'You\'re Amazing!',
      message: 'Congratulations on reaching this milestone with your store!',
    },
    general: {
      emoji: '👋',
      title: 'Hello from VendPadi!',
      message: 'Just checking in! How\'s your store doing? We\'re here to help.',
    },
  };

  const greeting = greetings[greetingType] || greetings.general;
  const dashboardUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/dashboard` : 'http://localhost:5173/dashboard';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="${headerStyles}">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${greeting.emoji} ${greeting.title}</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Hi ${businessName}!
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 24px;">
            ${greeting.message}
          </p>

          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">💡 Quick Tips:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
              <li>Keep your products updated with current prices</li>
              <li>Share your store link on WhatsApp status daily</li>
              <li>Respond quickly to customer orders</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${dashboardUrl}" style="${secondaryButtonStyles}">
              Visit Your Dashboard
            </a>
          </div>
        </div>
        <div style="${footerStyles}">
          <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
            <strong>VendPadi</strong> - Build your WhatsApp store in minutes
          </p>
          <p style="color: #999; margin: 0; font-size: 12px;">
            Questions? Reply to this email or visit <a href="${process.env.CLIENT_URL || '#'}" style="color: #25C675;">vendpadi.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `${greeting.emoji} ${greeting.title} - VendPadi`,
    html,
  });
};

exports.sendOrderNotificationEmail = async (email, businessName, orderDetails) => {
  const { customerName, items, total, orderId, date } = orderDetails;
  
  const itemsList = items
    .map(item => `<li style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">${item.qty}x ${item.name} - ₦${item.price.toLocaleString()}</li>`)
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="${headerStyles}">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🛒 New Order!</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Great news, ${businessName}!
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 24px;">
            You received a new order from <strong>${customerName || 'a customer'}</strong>!
          </p>

          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #666;">Order ID:</span>
              <strong style="color: #1a1a2e;">#${orderId?.slice(-8).toUpperCase()}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #666;">Date:</span>
              <strong style="color: #1a1a2e;">${date}</strong>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
            <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">Items:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${itemsList}
            </ul>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
            <div style="display: flex; justify-content: space-between;">
              <strong style="color: #1a1a2e; font-size: 18px;">Total:</strong>
              <strong style="color: #25C675; font-size: 18px;">₦${total?.toLocaleString()}</strong>
            </div>
          </div>

          <p style="color: #666; line-height: 1.7; margin: 0 0 24px;">
            This order was sent via WhatsApp. Please check your WhatsApp messages to confirm and fulfill it.
          </p>
        </div>
        <div style="${footerStyles}">
          <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
            <strong>VendPadi</strong> - Build your WhatsApp store in minutes
          </p>
          <p style="color: #999; margin: 0; font-size: 12px;">
            <a href="${process.env.CLIENT_URL || '#'}" style="color: #25C675;">vendpadi.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `🛒 New Order #${orderId?.slice(-8).toUpperCase()} - VendPadi`,
    html,
  });
};
