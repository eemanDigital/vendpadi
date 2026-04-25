const express = require('express');
const router = express.Router();
const manualInvoiceController = require('../controllers/manualInvoiceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, manualInvoiceController.getInvoices);
router.get('/stats', protect, manualInvoiceController.getInvoiceStats);
router.get('/:id', protect, manualInvoiceController.getInvoice);
router.post('/', protect, manualInvoiceController.createInvoice);
router.put('/:id', protect, manualInvoiceController.updateInvoice);
router.delete('/:id', protect, manualInvoiceController.deleteInvoice);
router.post('/:id/sent', protect, manualInvoiceController.markAsSent);
router.post('/:id/payment', protect, manualInvoiceController.recordPayment);

module.exports = router;