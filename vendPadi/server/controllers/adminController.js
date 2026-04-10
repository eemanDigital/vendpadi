const Vendor = require('../models/Vendor');
const PlanRequest = require('../models/PlanRequest');
const { sendPlanUpgradeEmail, sendGreetingEmail } = require('../utils/email');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const PLAN_FEATURES = {
  free: ['5 products', '1 image per product', 'Basic support'],
  basic: ['20 products', '3 images per product', 'Logo upload', 'Priority support'],
  premium: ['Unlimited products', '3 images per product', 'Logo upload', 'PDF invoices & receipts', 'Priority support']
};

exports.getAllVendors = catchAsync(async (req, res) => {
  const vendors = await Vendor.find({ isAdmin: { $ne: true } })
    .select('-passwordHash')
    .sort({ createdAt: -1 });
  
  res.json(vendors);
});

exports.getVendorById = catchAsync(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id).select('-passwordHash');
  
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }
  
  res.json(vendor);
});

exports.approvePlanRequest = catchAsync(async (req, res) => {
  const { vendorId, planType } = req.body;
  
  if (!vendorId || !planType) {
    return res.status(400).json({ message: 'Vendor ID and plan type are required' });
  }

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  const expiresAt = new Date();
  if (planType === 'basic') {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else if (planType === 'premium') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }

  vendor.plan = {
    type: planType,
    expiresAt
  };
  await vendor.save();

  await PlanRequest.findOneAndUpdate(
    { vendorId, status: 'pending' },
    { status: 'approved', reviewedAt: new Date() }
  );

  sendPlanUpgradeEmail(vendor.email, vendor.businessName, planType, PLAN_FEATURES[planType])
    .catch(err => console.error('Failed to send upgrade email:', err));

  res.json({ 
    message: 'Plan approved successfully',
    plan: vendor.plan
  });
});

exports.rejectPlanRequest = catchAsync(async (req, res) => {
  const { vendorId, reason } = req.body;
  
  await PlanRequest.findOneAndUpdate(
    { vendorId, status: 'pending' },
    { status: 'rejected', reason, reviewedAt: new Date() }
  );
  
  res.json({ message: 'Plan request rejected' });
});

exports.sendGreeting = catchAsync(async (req, res) => {
  const { greetingType, vendorIds } = req.body;
  
  const validTypes = ['newYear', 'holiday', 'milestone', 'general'];
  if (!validTypes.includes(greetingType)) {
    return res.status(400).json({ message: 'Invalid greeting type' });
  }

  let query = { isAdmin: { $ne: true } };
  if (vendorIds && vendorIds.length > 0) {
    query._id = { $in: vendorIds };
  }

  const vendors = await Vendor.find(query).select('email businessName');
  
  let sent = 0;
  let failed = 0;

  for (const vendor of vendors) {
    try {
      await sendGreetingEmail(vendor.email, vendor.businessName, greetingType);
      sent++;
    } catch (err) {
      console.error(`Failed to send to ${vendor.email}:`, err);
      failed++;
    }
  }

  res.json({ 
    message: `Greetings sent`,
    sent,
    failed,
    total: vendors.length
  });
});

exports.getVendorStats = catchAsync(async (req, res) => {
  const [total, free, basic, premium] = await Promise.all([
    Vendor.countDocuments({ isAdmin: { $ne: true } }),
    Vendor.countDocuments({ 'plan.type': 'free', isAdmin: { $ne: true } }),
    Vendor.countDocuments({ 'plan.type': 'basic', isAdmin: { $ne: true } }),
    Vendor.countDocuments({ 'plan.type': 'premium', isAdmin: { $ne: true } })
  ]);

  res.json({ total, free, basic, premium });
});
