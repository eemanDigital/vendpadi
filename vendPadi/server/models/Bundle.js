const mongoose = require('mongoose');

const bundleItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  image: String
});

const bundleSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  products: { type: [bundleItemSchema], required: true, validate: [arr => arr.length >= 2, 'Bundle must have at least 2 products'] },
  originalPrice: { type: Number, required: true },
  bundlePrice: { type: Number, required: true },
  image: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  isDealOfTheDay: { type: Boolean, default: false },
  dealStartTime: { type: Date, default: null },
  dealEndTime: { type: Date, default: null },
  clickCount: { type: Number, default: 0 }
}, { timestamps: true });

bundleSchema.virtual('savings').get(function() {
  return this.originalPrice - this.bundlePrice;
});

bundleSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice === 0) return 0;
  return Math.round(((this.originalPrice - this.bundlePrice) / this.originalPrice) * 100);
});

bundleSchema.virtual('isDealActive').get(function() {
  if (!this.isDealOfTheDay) return false;
  const now = new Date();
  const start = this.dealStartTime ? new Date(this.dealStartTime) : null;
  const end = this.dealEndTime ? new Date(this.dealEndTime) : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
});

bundleSchema.set('toJSON', { virtuals: true });
bundleSchema.set('toObject', { virtuals: true });

bundleSchema.index({ vendorId: 1, isActive: 1 });
bundleSchema.index({ vendorId: 1, isDealOfTheDay: 1, isActive: 1 });

module.exports = mongoose.model('Bundle', bundleSchema);
