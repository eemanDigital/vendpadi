const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', reviewController.createReview);
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/vendor', protect, reviewController.getVendorReviews);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
