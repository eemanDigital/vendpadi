const mongoose = require('mongoose');
const crypto = require('crypto');

const vendorSchema = new mongoose.Schema({
  businessName: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true },
  logo: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['food', 'fashion', 'phones', 'cakes', 'other'],
    default: 'other'
  },
  plan: {
    type: { type: String, enum: ['free', 'starter', 'business', 'premium'], default: 'free' },
    expiresAt: { type: Date, default: null }
  },
  analytics: {
    viewsCount: { type: Number, default: 0 },
    whatsappClicks: { type: Number, default: 0 },
    lastViewedAt: { type: Date, default: null }
  },
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null }
}, { timestamps: true });

vendorSchema.methods.generateResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('Vendor', vendorSchema);
