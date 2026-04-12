const mongoose = require('mongoose');

const planRequestSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  currentPlan: { type: String, enum: ['free', 'starter', 'business', 'premium'], required: true },
  requestedPlan: { type: String, enum: ['starter', 'business', 'premium'], required: true },
  billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['bank_transfer', 'ussd', 'other'], default: 'bank_transfer' },
  paymentProof: { type: String, default: '' },
  paymentReference: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNotes: { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('PlanRequest', planRequestSchema);
