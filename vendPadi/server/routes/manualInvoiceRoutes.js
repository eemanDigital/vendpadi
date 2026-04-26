const express = require('express');
const router = express.Router();
const manualInvoiceController = require('../controllers/manualInvoiceController');
const { protect } = require('../middleware/authMiddleware');
const { checkInvoiceAccess } = require('../middleware/planMiddleware');

router.use(protect, checkInvoiceAccess);

router.get('/', manualInvoiceController.getInvoices);
router.get('/stats', manualInvoiceController.getInvoiceStats);
router.get('/:id', manualInvoiceController.getInvoice);
router.post('/', manualInvoiceController.createInvoice);
router.put('/:id', manualInvoiceController.updateInvoice);
router.delete('/:id', manualInvoiceController.deleteInvoice);
router.post('/:id/sent', manualInvoiceController.markAsSent);
router.post('/:id/payment', manualInvoiceController.recordPayment);

module.exports = router;