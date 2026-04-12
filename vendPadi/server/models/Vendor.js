const mongoose = require('mongoose');
const crypto = require('crypto');

const TRIAL_DAYS = 7;

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
    default: 'other'
  },
  plan: {
    type: { type: String, enum: ['free', 'starter', 'business', 'premium'], default: 'free' },
    expiresAt: { type: Date, default: null }
  },
  trial: {
    active: { type: Boolean, default: false },
    plan: { type: String, enum: ['starter', 'business', 'premium'], default: null },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    used: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false }
  },
  followUp: {
    productAdded: { type: Boolean, default: false },
    firstOrder: { type: Boolean, default: false }
  },
  customLink: { type: String, default: '' },
  analytics: {
    viewsCount: { type: Number, default: 0 },
    whatsappClicks: { type: Number, default: 0 },
    lastViewedAt: { type: Date, default: null },
    totalRevenue: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  deletedAt: { type: Date, default: null },
  deletionRequestedAt: { type: Date, default: null },
  deletionReason: { type: String, default: '' }
}, { timestamps: true });

vendorSchema.index({ deletedAt: 1 });
vendorSchema.index({ email: 1 });
vendorSchema.index({ slug: 1 });

vendorSchema.methods.generateResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

vendorSchema.methods.startTrial = function(trialPlan = 'premium') {
  const now = new Date();
  this.trial = {
    active: true,
    plan: trialPlan,
    startDate: now,
    endDate: new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000),
    used: true
  };
};

vendorSchema.methods.checkTrialExpired = function() {
  if (this.trial.active && this.trial.endDate) {
    if (new Date() > this.trial.endDate) {
      this.trial.active = false;
      this.trial.plan = null;
      return true;
    }
  }
  return false;
};

vendorSchema.methods.getTrialDaysRemaining = function() {
  if (this.trial.active && this.trial.endDate) {
    const now = new Date();
    const end = new Date(this.trial.endDate);
    const diff = end - now;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  return 0;
};

vendorSchema.methods.getEffectivePlan = function() {
  this.checkTrialExpired();
  if (this.trial.active && this.trial.plan) {
    return this.trial.plan;
  }
  return this.plan.type;
};

vendorSchema.methods.disableTrial = function() {
  this.trial.active = false;
  this.trial.plan = null;
};

vendorSchema.methods.requestDeletion = function(reason = '') {
  this.deletionRequestedAt = new Date();
  this.deletionReason = reason;
  this.isActive = false;
};

vendorSchema.methods.restoreAccount = function() {
  this.deletionRequestedAt = null;
  this.deletionReason = '';
  this.isActive = true;
};

vendorSchema.methods.anonymize = function() {
  const randomSuffix = crypto.randomBytes(4).toString('hex');
  this.businessName = `Deleted Account`;
  this.email = `deleted_${randomSuffix}@anonymized.local`;
  this.phone = '';
  this.logo = '';
  this.coverImage = '';
  this.description = '';
  this.customLink = '';
  this.passwordHash = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = null;
  this.resetPasswordExpires = null;
  this.plan = { type: 'free', expiresAt: null };
  this.trial = { active: false, plan: null, startDate: null, endDate: null, used: true, reminderSent: false };
};

vendorSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

vendorSchema.query.byActive = function() {
  return this.where({ isActive: true, deletedAt: null });
};

module.exports = mongoose.model('Vendor', vendorSchema);
