const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  phone: { type: String, required: true, trim: true },
  storeSlug: { type: String, required: true, trim: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    images: [String],
    category: String,
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

wishlistSchema.index({ phone: 1, storeSlug: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
