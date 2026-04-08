const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  businessName: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true },
  logo: { type: String, default: '' },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['food', 'fashion', 'phones', 'cakes', 'other'],
    default: 'other'
  },
  plan: {
    type: { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
    expiresAt: { type: Date, default: null }
  },
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
