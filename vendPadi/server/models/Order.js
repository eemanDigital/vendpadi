const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  customerName: { type: String, default: 'Anonymous' },
  customerPhone: { type: String, default: '' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    qty: { type: Number, default: 1 },
    originalPrice: Number,
    isBundle: Boolean,
    bundleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bundle' },
    isFlashSale: Boolean
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  note: { type: String, default: '' },
  deliveryInfo: {
    zone: String,
    fee: { type: Number, default: 0 },
    estimatedDays: String
  },
  stockReduced: { type: Boolean, default: false },
  revenueAdded: { type: Boolean, default: false },
  followUpSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
