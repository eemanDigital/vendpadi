const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  inStock: { type: Boolean, default: true },
  category: { type: String, default: '' },
  stock: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 5, min: 1 },
  clickCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  flashSale: {
    isActive: { type: Boolean, default: false },
    discountPrice: { type: Number, default: null },
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    originalStock: { type: Number, default: null }
  }
}, { timestamps: true });

productSchema.index({ vendorId: 1, createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ vendorId: 1, clickCount: -1 });
productSchema.index({ vendorId: 1, viewCount: -1 });

productSchema.virtual('isLowStock').get(function() {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

productSchema.virtual('isFlashSaleActive').get(function() {
  if (!this.flashSale || !this.flashSale.isActive) return false;
  const now = new Date();
  const start = this.flashSale.startTime ? new Date(this.flashSale.startTime) : null;
  const end = this.flashSale.endTime ? new Date(this.flashSale.endTime) : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
});

productSchema.virtual('flashSaleEndsIn').get(function() {
  if (!this.isFlashSaleActive || !this.flashSale.endTime) return null;
  const now = new Date();
  const end = new Date(this.flashSale.endTime);
  const diff = end - now;
  if (diff <= 0) return null;
  return Math.max(0, diff);
});

productSchema.virtual('discountPercentage').get(function() {
  if (!this.isFlashSaleActive || !this.flashSale.discountPrice) return null;
  const discount = ((this.price - this.flashSale.discountPrice) / this.price) * 100;
  return Math.round(discount);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
