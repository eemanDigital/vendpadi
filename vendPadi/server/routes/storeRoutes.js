const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.get('/:slug', storeController.getStore);
router.post('/:slug/order', storeController.createOrder);

module.exports = router;
