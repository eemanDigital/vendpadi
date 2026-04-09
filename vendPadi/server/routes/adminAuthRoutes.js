const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Vendor = require('../models/Vendor');

router.post('/login', async (req, res) => {
  try {
    const { email, secretCode } = req.body;

    if (!email || !secretCode) {
      return res.status(400).json({ message: 'Email and secret code are required' });
    }

    if (
      email === process.env.ADMIN_EMAIL &&
      secretCode === process.env.ADMIN_SECRET
    ) {
      let admin = await Vendor.findOne({ email: email.toLowerCase() });
      
      if (!admin) {
        const passwordHash = await bcrypt.hash(process.env.ADMIN_SECRET, 10);
        admin = await Vendor.create({
          businessName: 'VendPadi Admin',
          slug: 'vendpadi-admin',
          email: email.toLowerCase(),
          passwordHash,
          phone: '0000000000',
          category: 'other',
          isAdmin: true
        });
      }

      const token = jwt.sign(
        { id: admin._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.json({
        token,
        admin: {
          email: process.env.ADMIN_EMAIL,
          businessName: 'VendPadi Admin',
          isAdmin: true
        }
      });
    }

    return res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
