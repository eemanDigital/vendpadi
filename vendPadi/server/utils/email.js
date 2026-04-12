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

exports.sendTrialStartedEmail = async (email, businessName, trialPlan, endDate) => {
  const dashboardUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/dashboard` : 'http://localhost:5173/dashboard';
  const settingsUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/settings` : 'http://localhost:5173/settings';
  const endDateFormatted = new Date(endDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="background: linear-gradient(135deg, #F5A623 0%, #F8E71C 100%); padding: 32px; text-align: center;">
          <h1 style="color: #1a1a2e; margin: 0; font-size: 28px; font-weight: bold;">🔥 Premium Trial Activated!</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Hi ${businessName}! 🎉
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            Your <strong style="color: #F5A623;">${trialPlan.charAt(0).toUpperCase() + trialPlan.slice(1)} trial</strong> is now active! For the next <strong>7 days</strong>, you have full access to all premium features.
          </p>
          
          <div style="background: #FFF9E6; border: 1px solid #F5A623; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="color: #1a1a2e; margin: 0 0 8px; font-size: 14px;">Trial ends on</p>
            <p style="color: #F5A623; margin: 0; font-size: 20px; font-weight: bold;">${endDateFormatted}</p>
          </div>

          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">🔥 What's unlocked:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
              <li>Unlimited products</li>
              <li>8 images per product</li>
              <li>Cover image for your store</li>
              <li>Custom store link</li>
              <li>Full analytics dashboard</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${dashboardUrl}" style="${buttonStyles}">
              Explore Premium Features 🚀
            </a>
          </div>

          <p style="color: #666; line-height: 1.7; margin: 0 0 16px; font-size: 14px;">
            Not ready to commit? No worries! After your trial ends, you'll automatically switch to the Free plan.
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
    subject: `🔥 Your VendPadi Premium Trial is Active!`,
    html,
  });
};

exports.sendTrialExpiringReminderEmail = async (email, businessName, daysRemaining, trialPlan) => {
  const dashboardUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/dashboard` : 'http://localhost:5173/dashboard';
  const upgradeUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/settings` : 'http://localhost:5173/settings';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">⏰ Trial Ending Soon!</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Hi ${businessName}!
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            Your <strong style="color: #F5A623;">${trialPlan.charAt(0).toUpperCase() + trialPlan.slice(1)} trial</strong> is ending in <strong style="color: #FF6B6B;">${daysRemaining} day${daysRemaining > 1 ? 's' : ''}</strong>.
          </p>
          
          <div style="background: #FFE8E8; border: 1px solid #FF6B6B; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="color: #FF6B6B; margin: 0; font-size: 18px; font-weight: bold;">
              ${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left to experience Premium
            </p>
          </div>

          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            Don't lose access to the features you've been using. Upgrade now to keep everything working seamlessly.
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${upgradeUrl}" style="${buttonStyles}">
              Upgrade Now 💎
            </a>
          </div>

          <p style="color: #999; line-height: 1.7; margin: 0; font-size: 14px; text-align: center;">
            Or continue with our free plan - no credit card required!
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
    subject: `⏰ Your VendPadi trial ends in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}!`,
    html,
  });
};

exports.sendTrialExpiredEmail = async (email, businessName) => {
  const dashboardUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/dashboard` : 'http://localhost:5173/dashboard';
  const upgradeUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/settings` : 'http://localhost:5173/settings';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="background: linear-gradient(135deg, #666 0%, #999 100%); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Trial Ended</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Hi ${businessName}!
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            Your VendPadi Premium trial has ended. You've been automatically moved to the Free plan.
          </p>
          
          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">What's on Free plan:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
              <li>5 products</li>
              <li>1 image per product</li>
              <li>WhatsApp orders</li>
              <li>Basic store</li>
            </ul>
          </div>

          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            Want to unlock all features again? Upgrade to continue growing your business!
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${upgradeUrl}" style="${buttonStyles}">
              View Plans 💎
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
    subject: `Your VendPadi Premium trial has ended`,
    html,
  });
};

exports.sendFirstOrderFollowUpEmail = async (email, businessName, orderCount, revenue) => {
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
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">📈 You're Getting Orders!</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Hi ${businessName}! 🎉
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            Great news! Your VendPadi store is getting traction. You've received <strong>${orderCount} order${orderCount > 1 ? 's' : ''}</strong> with a total of <strong style="color: #25C675;">₦${revenue?.toLocaleString()}</strong> in revenue!
          </p>

          <div style="background: #f0fdf4; border: 1px solid #25C675; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="color: #1a1a2e; margin: 0 0 8px; font-size: 16px;">Total Revenue</p>
            <p style="color: #25C675; margin: 0; font-size: 28px; font-weight: bold;">₦${revenue?.toLocaleString()}</p>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${dashboardUrl}" style="${buttonStyles}">
              View Your Analytics 📊
            </a>
          </div>

          <p style="color: #666; line-height: 1.7; margin: 0; font-size: 14px;">
            Keep adding products and sharing your store to get more orders!
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
    subject: `📈 Your VendPadi store made ₦${revenue?.toLocaleString()}!`,
    html,
  });
};

exports.sendFirstProductFollowUpEmail = async (email, businessName) => {
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
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🛍️ Ready to Sell?</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Hi ${businessName}! 👋
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            You've set up your VendPadi store - that's awesome! 🎉 Now let's get your first sale.
          </p>

          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">💡 Quick tips to get orders:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
              <li>Share your store link on WhatsApp status</li>
              <li>Add more products - customers love variety</li>
              <li>Add clear prices and descriptions</li>
              <li>Respond quickly to order messages</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${dashboardUrl}" style="${buttonStyles}">
              Add More Products 🛍️
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
    subject: `🛍️ Your VendPadi store is ready - let's get your first sale!`,
    html,
  });
};

exports.sendAccountDeletionRequestedEmail = async (email, businessName) => {
  const loginUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/login` : 'http://localhost:5173/login';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">⚠️ Account Deletion Requested</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Hi ${businessName},
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            We received a request to delete your VendPadi account. Your account has been deactivated.
          </p>

          <div style="background: #FFF3E0; border: 1px solid #FF8E53; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">⏰ What happens next:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
              <li>Your account will be <strong>disabled immediately</strong></li>
              <li>Your data will be <strong>permanently deleted after 30 days</strong></li>
              <li>You can <strong>restore your account</strong> by logging in within 30 days</li>
            </ul>
          </div>

          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            If you didn't request this deletion, please contact us immediately.
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${loginUrl}" style="${buttonStyles}">
              Restore My Account
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
    subject: `⚠️ Account Deletion Requested - VendPadi`,
    html,
  });
};

exports.sendAccountDeletionWarningEmail = async (email, businessName, daysRemaining) => {
  const loginUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/login` : 'http://localhost:5173/login';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="background: linear-gradient(135deg, #FF6B6B 0%, #C0392B 100%); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🚨 Final Warning - Account Deletion</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Hi ${businessName},
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            This is your <strong>final reminder</strong>. Your VendPadi account will be <strong>permanently deleted in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}</strong>.
          </p>

          <div style="background: #FFEBEE; border: 2px solid #FF6B6B; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
            <p style="color: #C0392B; margin: 0; font-size: 20px; font-weight: bold;">
              ${daysRemaining} day${daysRemaining > 1 ? 's' : ''} remaining before permanent deletion
            </p>
          </div>

          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">⚠️ What will be deleted:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
              <li>All your products</li>
              <li>Your store settings</li>
              <li>Your store link</li>
              <li>All analytics data</li>
            </ul>
          </div>

          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            <strong>Important:</strong> Order records will be retained for legal compliance, but your personal information will be anonymized.
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${loginUrl}" style="${buttonStyles}">
              Restore My Account Now
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
    subject: `🚨 Final Warning: VendPadi account deletion in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`,
    html,
  });
};

exports.sendAccountPermanentlyDeletedEmail = async (email, businessName) => {
  const signupUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/register` : 'http://localhost:5173/register';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="background: linear-gradient(135deg, #666 0%, #333 100%); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Account Permanently Deleted</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">
            Hi ${businessName},
          </h2>
          <p style="color: #666; line-height: 1.7; margin: 0 0 20px;">
            Your VendPadi account and all associated data have been <strong>permanently deleted</strong>. This action cannot be undone.
          </p>

          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px;">📋 What was deleted:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
              <li>All products</li>
              <li>Store settings and customizations</li>
              <li>Analytics and statistics</li>
              <li>Personal information</li>
            </ul>
          </div>

          <div style="background: #E3F2FD; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <p style="color: #1565C0; margin: 0; font-size: 14px;">
              <strong>Note:</strong> Transaction records are retained for legal compliance but have been anonymized.
            </p>
          </div>

          <p style="color: #666; line-height: 1.7; margin: 0 0 24px;">
            Thank you for using VendPadi. We're sorry to see you go. If you'd like to start fresh, you can create a new account anytime.
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${signupUrl}" style="${secondaryButtonStyles}">
              Create New Account
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
    subject: `Your VendPadi account has been deleted`,
    html,
  });
};
