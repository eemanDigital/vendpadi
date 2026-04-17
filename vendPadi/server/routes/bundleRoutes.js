const express = require('express');
const router = express.Router();
const bundleController = require('../controllers/bundleController');
const { protect } = require('../middleware/authMiddleware');
const { requirePlan } = require('../middleware/planMiddleware');

router.get('/vendor/:vendorId', bundleController.getBundles);
router.get('/vendor/:vendorId/deal', bundleController.getDealOfTheDay);
router.get('/:id', bundleController.getBundle);
router.get('/', protect, bundleController.getMyBundles);
router.post('/', protect, requirePlan('premium'), bundleController.createBundle);
router.put('/:id', protect, bundleController.updateBundle);
router.delete('/:id', protect, bundleController.deleteBundle);

module.exports = router;
