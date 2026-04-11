const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Vendor = require('../models/Vendor');

router.post('/login', async (req, res) => {
  try {
    const { email, secretCode } = req.body;
    console.log('Admin login attempt:', { email, envEmail: process.env.ADMIN_EMAIL, emailMatch: email === process.env.ADMIN_EMAIL });

    if (!email || !secretCode) {
      return res.status(400).json({ message: 'Email and secret code are required' });
    }

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const admin = await Vendor.findOne({ email: email.toLowerCase(), isAdmin: true });
    console.log('Admin vendor found:', admin ? 'yes' : 'no');
    
    if (!admin) {
      console.log('Creating new admin, secretCode:', secretCode, 'envSecret:', process.env.ADMIN_SECRET);
      if (secretCode !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
      const passwordHash = await bcrypt.hash(process.env.ADMIN_SECRET, 12);
      const newAdmin = await Vendor.create({
        businessName: 'VendPadi Admin',
        slug: 'vendpadi-admin',
        email: email.toLowerCase(),
        passwordHash,
        phone: '0000000000',
        category: 'other',
        isAdmin: true
      });

      const token = jwt.sign(
        { id: newAdmin._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d', algorithm: 'HS256' }
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

    const isMatch = await bcrypt.compare(secretCode, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d', algorithm: 'HS256' }
    );

    return res.json({
      token,
      admin: {
        email: process.env.ADMIN_EMAIL,
        businessName: 'VendPadi Admin',
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
