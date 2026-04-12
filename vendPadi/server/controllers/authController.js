const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const Vendor = require('../models/Vendor');
const generateSlug = require('../utils/generateSlug');
const { sendPasswordResetEmail, sendWelcomeEmail, sendTrialStartedEmail } = require('../utils/email');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: '30d',
    algorithm: 'HS256'
  });
};

exports.register = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { businessName, email, password, phone, category, adminCode } = req.body;

  if (!businessName || !email || !password || !phone || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const vendorExists = await Vendor.findOne({ email: email.toLowerCase() });
  if (vendorExists) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const slug = await generateSlug(businessName);

  const isAdmin = adminCode === process.env.ADMIN_SECRET_KEY;

  const vendor = await Vendor.create({
    businessName,
    slug,
    email: email.toLowerCase(),
    passwordHash,
    phone,
    category,
    isAdmin
  });

  vendor.startTrial('premium');
  await vendor.save();

  const token = generateToken(vendor._id);

  sendWelcomeEmail(vendor.email, vendor.businessName).catch(err => {
    console.error('Failed to send welcome email:', err);
  });

  sendTrialStartedEmail(
    vendor.email, 
    vendor.businessName, 
    vendor.trial.plan, 
    vendor.trial.endDate
  ).catch(err => {
    console.error('Failed to send trial start email:', err);
  });

  res.status(201).json({
    token,
    vendor: {
      _id: vendor._id,
      businessName: vendor.businessName,
      slug: vendor.slug,
      email: vendor.email,
      phone: vendor.phone,
      category: vendor.category,
      plan: vendor.plan,
      trial: vendor.trial,
      logo: vendor.logo,
      coverImage: vendor.coverImage,
      customLink: vendor.customLink,
      description: vendor.description,
      isAdmin: vendor.isAdmin
    }
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const vendor = await Vendor.findOne({ email: email.toLowerCase() });
  if (!vendor) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!vendor.isActive) {
    return res.status(403).json({ message: 'Account has been deactivated' });
  }

  const isMatch = await bcrypt.compare(password, vendor.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  vendor.checkTrialExpired();
  await vendor.save();

  const token = generateToken(vendor._id);

  res.json({
    token,
    vendor: {
      _id: vendor._id,
      businessName: vendor.businessName,
      slug: vendor.slug,
      email: vendor.email,
      phone: vendor.phone,
      category: vendor.category,
      plan: vendor.plan,
      trial: vendor.trial,
      logo: vendor.logo,
      coverImage: vendor.coverImage,
      customLink: vendor.customLink,
      description: vendor.description,
      isAdmin: vendor.isAdmin
    }
  });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const vendor = await Vendor.findOne({ email: email.toLowerCase() });

  if (!vendor) {
    return res.status(200).json({ 
      message: 'If an account exists with this email, you will receive a password reset link.' 
    });
  }

  const resetToken = vendor.generateResetToken();
  await vendor.save({ validateBeforeSave: false });

  await sendPasswordResetEmail(vendor.email, resetToken, vendor.businessName);

  res.status(200).json({ 
    message: 'If an account exists with this email, you will receive a password reset link.' 
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const vendor = await Vendor.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!vendor) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  vendor.passwordHash = await bcrypt.hash(password, 10);
  vendor.resetPasswordToken = null;
  vendor.resetPasswordExpires = null;
  await vendor.save();

  res.status(200).json({ message: 'Password has been reset successfully' });
});

exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const vendorId = req.vendor?.id || req.vendor?._id;

  if (!vendorId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(currentPassword, vendor.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  vendor.passwordHash = await bcrypt.hash(newPassword, 10);
  vendor.resetPasswordToken = null;
  vendor.resetPasswordExpires = null;
  await vendor.save();

  res.status(200).json({ message: 'Password changed successfully' });
});
