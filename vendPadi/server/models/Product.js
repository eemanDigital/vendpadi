const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  inStock: { type: Boolean, default: true },
  category: { type: String, default: '' }
}, { timestamps: true });

productSchema.index({ vendorId: 1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
