const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.get('/:slug', storeController.getStore);
router.post('/:slug/order', storeController.createOrder);

router.get('/custom/:customLink', storeController.getStoreByCustomLink);
router.post('/custom/:customLink/order', storeController.createOrderByCustomLink);

module.exports = router;
