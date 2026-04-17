const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');
const { requirePlan, getTrialInfo } = require('../middleware/planMiddleware');
const { checkLogoUpload, checkCoverImage } = require('../middleware/planMiddleware');
const { uploadVendorLogo, uploadCoverImage, uploadDocument } = require('../middleware/uploadMiddleware');

router.get('/me', protect, vendorController.getMe);
router.put('/me', protect, vendorController.updateMe);
router.put('/me/logo', protect, checkLogoUpload, uploadVendorLogo, vendorController.updateLogo);
router.post('/me/cover', protect, checkCoverImage, uploadCoverImage, vendorController.updateCoverImage);
router.put('/me/custom-link', protect, requirePlan('premium'), vendorController.updateCustomLink);
router.get('/trial-status', protect, getTrialInfo);
router.post('/me/verify', protect, uploadDocument, vendorController.submitVerification);
router.put('/me/delivery-zones', protect, requirePlan('business'), vendorController.updateDeliveryZones);
router.get('/me/delivery-zones', protect, vendorController.getDeliveryZones);

module.exports = router;
