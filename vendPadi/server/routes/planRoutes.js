const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const PlanRequest = require('../models/PlanRequest');
const Vendor = require('../models/Vendor');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const DEFAULT_PAYMENT = {
  bankName: 'First Bank of Nigeria',
  accountName: 'VendPadi Ltd',
  accountNumber: '3084721938'
};

let storage, upload;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'vendpadi/payments' }
  });

  upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
} else {
  storage = multer.memoryStorage();
  upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
  console.warn('Cloudinary not configured, using memory storage for plan proofs');
}

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const PLANS = {
  starter: { price: 1000, name: 'Starter', interval: 'monthly', products: 30, images: 3 },
  business: { price: 2500, name: 'Business', interval: 'monthly', products: 100, images: 5 },
  premium: { price: 5000, name: 'Premium', interval: 'monthly', products: 'unlimited', images: 8 }
};

router.get('/', (req, res) => {
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
  
  if (!['starter', 'business', 'premium'].includes(requestedPlan)) {
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

router.get('/admin/requests', protect, adminOnly, catchAsync(async (req, res) => {
  const requests = await PlanRequest.find({ status: 'pending' })
    .populate('vendorId', 'businessName email phone slug')
    .sort({ createdAt: 1 });
  res.json(requests);
}));

router.get('/admin/stats', protect, adminOnly, catchAsync(async (req, res) => {
  const totalVendors = await Vendor.countDocuments();
  
  const planStats = await Vendor.aggregate([
    {
      $group: {
        _id: '$plan.type',
        count: { $sum: 1 }
      }
    }
  ]);

  const stats = {
    total: totalVendors,
    byPlan: {
      free: 0,
      starter: 0,
      business: 0,
      premium: 0
    }
  };

  planStats.forEach(stat => {
    if (stat._id && stats.byPlan.hasOwnProperty(stat._id)) {
      stats.byPlan[stat._id] = stat.count;
    }
  });

  const pendingRequests = await PlanRequest.countDocuments({ status: 'pending' });
  const approvedThisMonth = await PlanRequest.countDocuments({
    status: 'approved',
    reviewedAt: { $gte: new Date(new Date().setDate(1)) }
  });

  stats.pendingRequests = pendingRequests;
  stats.approvedThisMonth = approvedThisMonth;

  res.json(stats);
}));

router.get('/admin/subscribers', protect, adminOnly, catchAsync(async (req, res) => {
  const { plan, format } = req.query;
  
  const query = {};
  if (plan && plan !== 'all') {
    query['plan.type'] = plan;
  }

  if (format === 'grouped') {
    const grouped = {
      free: [],
      starter: [],
      business: [],
      premium: []
    };

    const subscribers = await Vendor.find(query)
      .select('businessName email phone plan.type plan.expiresAt createdAt slug logo')
      .sort({ createdAt: -1 });

    subscribers.forEach(sub => {
      const planType = sub.plan?.type || 'free';
      if (grouped[planType]) {
        grouped[planType].push(sub);
      }
    });

    const counts = {
      total: subscribers.length,
      free: grouped.free.length,
      starter: grouped.starter.length,
      business: grouped.business.length,
      premium: grouped.premium.length
    };

    const revenue = {
      starter: grouped.starter.length * 1000,
      business: grouped.business.length * 2500,
      premium: grouped.premium.length * 5000
    };

    res.json({ grouped, counts, revenue });
  } else {
    if (!plan || plan === 'all') {
      query['plan.type'] = { $ne: 'free' };
    }

    const subscribers = await Vendor.find(query)
      .select('businessName email phone plan.type plan.expiresAt createdAt')
      .sort({ createdAt: -1 });

    res.json(subscribers);
  }
}));

router.put('/admin/approve/:id', protect, adminOnly, catchAsync(async (req, res) => {
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
  vendor.trial.active = false;
  vendor.trial.plan = null;
  await vendor.save();

  res.json({ message: 'Plan upgraded successfully', request });
}));

router.put('/admin/reject/:id', protect, adminOnly, catchAsync(async (req, res) => {
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
