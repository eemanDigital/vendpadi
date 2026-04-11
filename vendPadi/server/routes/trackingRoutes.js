const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.post('/view/:slug', analyticsController.trackView);
router.post('/whatsapp-click/:slug', analyticsController.trackWhatsAppClick);
router.post('/product-view/:slug/:productId', analyticsController.trackProductView);

module.exports = router;
