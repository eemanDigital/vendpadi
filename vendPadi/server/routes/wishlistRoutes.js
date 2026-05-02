const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

const rateLimiter = require('express-rate-limit');
const wishlistLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { message: 'Too many wishlist requests, please try again later.' }
});

router.use(wishlistLimiter);

router.get('/:phone/:storeSlug', wishlistController.getWishlist);
router.post('/sync', wishlistController.syncWishlist);
router.post('/:phone/:storeSlug/add', wishlistController.addItem);
router.delete('/:phone/:storeSlug/:productId', wishlistController.removeItem);
router.post('/:phone/:storeSlug/toggle', wishlistController.toggleItem);
router.delete('/:phone/:storeSlug', wishlistController.clearWishlist);

module.exports = router;
