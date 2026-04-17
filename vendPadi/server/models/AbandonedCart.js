const mongoose = require('mongoose');

const abandonedCartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  qty: { type: Number, default: 1 },
  image: String
});

const abandonedCartSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  sessionId: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  customerName: { type: String, default: '' },
  items: { type: [abandonedCartItemSchema], default: [] },
  totalAmount: { type: Number, default: 0 },
  abandonedAt: { type: Date, default: Date.now },
  followUpSent: { type: Boolean, default: false },
  followUpSentAt: { type: Date, default: null },
  followUpCount: { type: Number, default: 0 },
  recovered: { type: Boolean, default: false },
  recoveredAt: { type: Date, default: null },
  storeUrl: { type: String, default: '' }
}, { timestamps: true });

abandonedCartSchema.index({ vendorId: 1, abandonedAt: -1 });
abandonedCartSchema.index({ vendorId: 1, followUpSent: 1 });
abandonedCartSchema.index({ sessionId: 1 });
abandonedCartSchema.index({ customerPhone: 1 });

abandonedCartSchema.methods.canSendFollowUp = function() {
  if (this.recovered) return false;
  if (this.followUpCount >= 2) return false;
  if (this.followUpSentAt) {
    const hoursSinceLastFollowUp = (Date.now() - new Date(this.followUpSentAt)) / (1000 * 60 * 60);
    if (hoursSinceLastFollowUp < 4) return false;
  }
  return true;
};

abandonedCartSchema.methods.shouldAbandon = function() {
  return this.items.length > 0 && !this.recovered;
};

module.exports = mongoose.model('AbandonedCart', abandonedCartSchema);
