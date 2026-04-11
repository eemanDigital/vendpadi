const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const requirePlan = (minPlan) => catchAsync(async (req, res, next) => {
  const plans = { free: 0, starter: 1, business: 2, premium: 3 };
  const vendorPlan = req.vendor.plan?.type || 'free';
  
  if (plans[vendorPlan] === undefined) {
    return res.status(400).json({ message: 'Invalid plan type' });
  }

  const expired = req.vendor.plan?.expiresAt && new Date() > new Date(req.vendor.plan.expiresAt);

  if (expired && vendorPlan !== 'free') {
    req.vendor.plan.type = 'free';
  }

  if (plans[vendorPlan] >= plans[minPlan]) {
    return next();
  }

  res.status(403).json({ 
    message: `This feature requires the ${minPlan} plan`,
    currentPlan: vendorPlan,
    requiredPlan: minPlan
  });
});

const checkProductLimit = catchAsync(async (req, res, next) => {
  const limits = { free: 5, starter: 30, business: 100, premium: Infinity };
  const plan = req.vendor.plan?.type || 'free';
  const limit = limits[plan] ?? 5;

  const Product = require('../models/Product');
  const count = await Product.countDocuments({ vendorId: req.vendor._id });
  
  if (count >= limit) {
    return res.status(403).json({
      message: `Your ${plan} plan allows maximum ${limit} products.`,
      currentCount: count,
      limit: limit,
      plan: plan
    });
  }
  next();
});

const checkImageLimit = catchAsync(async (req, res, next) => {
  const limits = { free: 1, starter: 3, business: 5, premium: 8 };
  const plan = req.vendor.plan?.type || 'free';
  const maxAllowed = limits[plan] || 1;

  if (req.files && req.files.length > maxAllowed) {
    return res.status(403).json({
      message: `Your ${plan} plan allows maximum ${maxAllowed} images per product.`,
      limit: maxAllowed,
      received: req.files.length
    });
  }
  next();
});

module.exports = { requirePlan, checkProductLimit, checkImageLimit };
