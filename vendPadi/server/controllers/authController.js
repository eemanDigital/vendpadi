const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Vendor = require('../models/Vendor');
const generateSlug = require('../utils/generateSlug');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { businessName, email, password, phone, category } = req.body;

    const vendorExists = await Vendor.findOne({ email });
    if (vendorExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const slug = await generateSlug(businessName);

    const vendor = await Vendor.create({
      businessName,
      slug,
      email,
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
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ message: 'Invalid email or password' });
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
