const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  customerName: { type: String, required: true, trim: true },
  customerPhone: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' }
}, { timestamps: true });

reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ vendorId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
