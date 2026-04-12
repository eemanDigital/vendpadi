const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const { hasAccess, getEffectivePlan, getTrialStatus } = require('../utils/trialUtils');

const getEffectivePlanWithTrial = (vendor) => {
  return getEffectivePlan(vendor);
};

const requirePlan = (minPlan) => catchAsync(async (req, res, next) => {
  req.vendor.checkTrialExpired();
  
  if (!hasAccess(req.vendor, minPlan)) {
    const currentPlan = getEffectivePlanWithTrial(req.vendor);
    return res.status(403).json({ 
      message: `This feature requires the ${minPlan} plan`,
      currentPlan,
      requiredPlan: minPlan,
      trialActive: req.vendor.trial?.active || false
    });
  }

  next();
});

const checkProductLimit = catchAsync(async (req, res, next) => {
  req.vendor.checkTrialExpired();
  
  const limits = { free: 5, starter: 30, business: 100, premium: Infinity };
  const plan = getEffectivePlanWithTrial(req.vendor);
  const limit = limits[plan] ?? 5;

  const Product = require('../models/Product');
  const count = await Product.countDocuments({ vendorId: req.vendor._id });
  
  if (count >= limit) {
    return res.status(403).json({
      message: `Your ${plan} plan allows maximum ${limit} products.`,
      currentCount: count,
      limit: limit,
      plan: plan,
      trialActive: req.vendor.trial?.active || false
    });
  }
  next();
});

const checkImageLimit = catchAsync(async (req, res, next) => {
  req.vendor.checkTrialExpired();
  
  const limits = { free: 1, starter: 3, business: 5, premium: 8 };
  const plan = getEffectivePlanWithTrial(req.vendor);
  const maxAllowed = limits[plan] || 1;

  if (req.files && req.files.length > maxAllowed) {
    return res.status(403).json({
      message: `Your ${plan} plan allows maximum ${maxAllowed} images per product.`,
      limit: maxAllowed,
      received: req.files.length,
      trialActive: req.vendor.trial?.active || false
    });
  }
  next();
});

const checkLogoUpload = catchAsync(async (req, res, next) => {
  req.vendor.checkTrialExpired();
  
  if (!hasAccess(req.vendor, 'starter')) {
    return res.status(403).json({
      message: 'Logo upload requires Starter plan or higher',
      currentPlan: getEffectivePlanWithTrial(req.vendor),
      requiredPlan: 'starter',
      trialActive: req.vendor.trial?.active || false
    });
  }
  next();
});

const checkCoverImage = catchAsync(async (req, res, next) => {
  req.vendor.checkTrialExpired();
  
  if (!hasAccess(req.vendor, 'premium')) {
    return res.status(403).json({
      message: 'Cover image requires Premium plan',
      currentPlan: getEffectivePlanWithTrial(req.vendor),
      requiredPlan: 'premium',
      trialActive: req.vendor.trial?.active || false
    });
  }
  next();
});

const checkAnalytics = catchAsync(async (req, res, next) => {
  req.vendor.checkTrialExpired();
  
  if (!hasAccess(req.vendor, 'starter')) {
    return res.status(403).json({
      message: 'Analytics requires Starter plan or higher',
      currentPlan: getEffectivePlanWithTrial(req.vendor),
      requiredPlan: 'starter',
      trialActive: req.vendor.trial?.active || false
    });
  }
  next();
});

const checkAdvancedSorting = catchAsync(async (req, res, next) => {
  req.vendor.checkTrialExpired();
  
  const sort = req.query.sort;
  const advancedSorts = ['price_asc', 'price_desc', 'stock_low', 'stock_high'];
  
  if (advancedSorts.includes(sort) && !hasAccess(req.vendor, 'business')) {
    return res.status(403).json({
      message: 'Advanced sorting requires Business plan or higher',
      currentPlan: getEffectivePlanWithTrial(req.vendor),
      requiredPlan: 'business',
      trialActive: req.vendor.trial?.active || false
    });
  }
  next();
});

const getTrialInfo = catchAsync(async (req, res) => {
  req.vendor.checkTrialExpired();
  await req.vendor.save();
  
  const trialStatus = getTrialStatus(req.vendor);
  const effectivePlan = getEffectivePlanWithTrial(req.vendor);
  
  res.json({
    effectivePlan,
    trial: trialStatus
  });
});

module.exports = { 
  requirePlan, 
  checkProductLimit, 
  checkImageLimit,
  checkLogoUpload,
  checkCoverImage,
  checkAnalytics,
  checkAdvancedSorting,
  getTrialInfo,
  hasAccess,
  getEffectivePlan,
  getTrialStatus
};
