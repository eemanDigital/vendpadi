const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');
const { uploadVendorLogo, uploadCoverImage } = require('../middleware/uploadMiddleware');

router.get('/me', protect, vendorController.getMe);
router.put('/me', protect, vendorController.updateMe);
router.put('/me/logo', protect, uploadVendorLogo, vendorController.updateLogo);
router.post('/me/cover', protect, uploadCoverImage, vendorController.updateCoverImage);

module.exports = router;
