const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { checkProductLimit, checkImageLimit, checkAdvancedSorting } = require('../middleware/planMiddleware');
const { uploadProductImages } = require('../middleware/uploadMiddleware');

router.get('/', protect, checkAdvancedSorting, productController.getProducts);
router.get('/low-stock', protect, productController.getLowStockProducts);
router.post('/', protect, checkProductLimit, productController.createProduct);
router.post('/images', protect, uploadProductImages, productController.uploadImagesStandalone);
router.put('/:id', protect, productController.updateProduct);
router.patch('/:id/stock', protect, productController.updateStock);
router.delete('/:id', protect, productController.deleteProduct);
router.post('/:id/images', protect, uploadProductImages, checkImageLimit, productController.uploadImages);

module.exports = router;
