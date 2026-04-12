const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', [
  body('businessName').trim().notEmpty().withMessage('Business name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').trim().notEmpty().withMessage('WhatsApp number is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('adminCode').optional().trim()
], authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required')
], authController.forgotPassword);

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.resetPassword);

router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], authController.changePassword);

router.post('/request-delete', protect, [
  body('password').notEmpty().withMessage('Password confirmation is required')
], authController.requestDeleteAccount);

router.post('/cancel-delete', protect, [
  body('password').notEmpty().withMessage('Password confirmation is required')
], authController.cancelDeleteAccount);

router.get('/deletion-status', protect, authController.getDeletionStatus);
router.get('/export-data', protect, authController.exportAccountData);

module.exports = router;
