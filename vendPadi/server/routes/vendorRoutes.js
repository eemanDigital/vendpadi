const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');
const { uploadVendorLogo } = require('../middleware/uploadMiddleware');

router.get('/me', protect, vendorController.getMe);
router.put('/me', protect, vendorController.updateMe);
router.put('/me/logo', protect, uploadVendorLogo, vendorController.updateLogo);

module.exports = router;
