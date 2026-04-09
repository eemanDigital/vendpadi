const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const PlanRequest = require('../models/PlanRequest');
const Vendor = require('../models/Vendor');
const { protect } = require('../middleware/authMiddleware');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'vendpadi/payments' }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const PLANS = {
  basic: { price: 1500, name: 'Basic', interval: 'monthly' },
  premium: { price: 3000, name: 'Premium', interval: 'monthly' }
};

router.get('/plans', (req, res) => {
  res.json({
    plans: PLANS,
    paymentDetails: {
      bankName: 'First Bank of Nigeria',
      accountName: 'VendPadi Ltd',
      accountNumber: '3084721938'
    }
  });
});

router.post('/upgrade', protect, catchAsync(async (req, res) => {
  const { requestedPlan } = req.body;
  
  if (!['basic', 'premium'].includes(requestedPlan)) {
    return res.status(400).json({ message: 'Invalid plan' });
  }

  if (req.vendor.plan.type === requestedPlan) {
    return res.status(400).json({ message: 'You are already on this plan' });
  }

  const existingPending = await PlanRequest.findOne({
    vendorId: req.vendor._id,
    requestedPlan,
    status: 'pending'
  });

  if (existingPending) {
    return res.status(400).json({ message: 'You already have a pending request for this plan' });
  }

  const planRequest = await PlanRequest.create({
    vendorId: req.vendor._id,
    currentPlan: req.vendor.plan.type,
    requestedPlan,
    amount: PLANS[requestedPlan].price
  });

  res.status(201).json(planRequest);
}));

router.get('/my-requests', protect, catchAsync(async (req, res) => {
  const requests = await PlanRequest.find({ vendorId: req.vendor._id })
    .sort({ createdAt: -1 });
  res.json(requests);
}));

router.delete('/request/:id', protect, catchAsync(async (req, res) => {
  const request = await PlanRequest.findOne({
    _id: req.params.id,
    vendorId: req.vendor._id,
    status: 'pending'
  });

  if (!request) {
    return res.status(404).json({ message: 'Request not found or cannot be cancelled' });
  }

  await PlanRequest.findByIdAndDelete(req.params.id);
  res.json({ message: 'Request cancelled' });
}));

router.post('/upload-proof/:id', protect, upload.single('proof'), catchAsync(async (req, res) => {
  const request = await PlanRequest.findOne({
    _id: req.params.id,
    vendorId: req.vendor._id
  });

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  if (req.file) {
    request.paymentProof = req.file.path;
  }
  if (req.body.paymentReference) {
    request.paymentReference = req.body.paymentReference;
  }

  await request.save();
  res.json(request);
}));

router.get('/admin/requests', protect, catchAsync(async (req, res) => {
  if (!req.vendor.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const requests = await PlanRequest.find({ status: 'pending' })
    .populate('vendorId', 'businessName email phone slug')
    .sort({ createdAt: 1 });
  res.json(requests);
}));

router.put('/admin/approve/:id', protect, catchAsync(async (req, res) => {
  if (!req.vendor.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const request = await PlanRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  const vendor = await Vendor.findById(request.vendorId);
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  request.status = 'approved';
  request.reviewedBy = req.vendor._id;
  request.reviewedAt = new Date();
  await request.save();

  vendor.plan.type = request.requestedPlan;
  vendor.plan.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await vendor.save();

  res.json({ message: 'Plan upgraded successfully', request });
}));

router.put('/admin/reject/:id', protect, catchAsync(async (req, res) => {
  if (!req.vendor.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { reason } = req.body;
  const request = await PlanRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  request.status = 'rejected';
  request.adminNotes = reason || '';
  request.reviewedBy = req.vendor._id;
  request.reviewedAt = new Date();
  await request.save();

  res.json({ message: 'Request rejected', request });
}));

module.exports = router;
