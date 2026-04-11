const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { checkAnalytics } = require('../middleware/planMiddleware');

router.get('/', protect, checkAnalytics, analyticsController.getAnalytics);

module.exports = router;
