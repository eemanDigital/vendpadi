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
  lowStockThreshold: { type: Number, default: 5, min: 1 }
}, { timestamps: true });

productSchema.index({ vendorId: 1, createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

productSchema.virtual('isLowStock').get(function() {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
