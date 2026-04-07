const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Vendor = require('../models/Vendor');
const generateSlug = require('../utils/generateSlug');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { businessName, email, password, phone, category } = req.body;

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

  const vendor = await Vendor.create({
    businessName,
    slug,
    email: email.toLowerCase(),
    passwordHash,
    phone,
    category
  });

  const token = generateToken(vendor._id);

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
      logo: vendor.logo,
      description: vendor.description
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
      logo: vendor.logo,
      description: vendor.description
    }
  });
});
