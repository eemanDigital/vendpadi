const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, orderController.getOrders);
router.get('/stats', protect, orderController.getOrderStats);
router.get('/:id', protect, orderController.getOrder);
router.put('/:id/status', protect, orderController.updateOrderStatus);

module.exports = router;
