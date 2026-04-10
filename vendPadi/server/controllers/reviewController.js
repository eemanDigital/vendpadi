const Review = require('../models/Review');
const Product = require('../models/Product');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.createReview = catchAsync(async (req, res) => {
  const { productId, rating, customerName, comment } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  if (!customerName || customerName.trim() === '') {
    return res.status(400).json({ message: 'Customer name is required' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const review = await Review.create({
    productId,
    vendorId: product.vendorId,
    rating: Number(rating),
    customerName: customerName.trim(),
    comment: comment?.trim() || ''
  });

  res.status(201).json(review);
});

exports.getProductReviews = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ productId })
    .sort({ createdAt: -1 });

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  res.json({
    reviews,
    averageRating,
    count: reviews.length
  });
});

exports.getVendorReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ vendorId: req.vendor._id })
    .sort({ createdAt: -1 });

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  res.json({
    reviews,
    averageRating,
    count: reviews.length
  });
});

exports.deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  if (review.vendorId.toString() !== req.vendor._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await Review.findByIdAndDelete(id);
  res.json({ message: 'Review deleted' });
});
