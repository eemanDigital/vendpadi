const requirePlan = (minPlan) => async (req, res, next) => {
  const plans = { free: 0, basic: 1, premium: 2 };
  const vendorPlan = req.vendor.plan.type;
  const expired = req.vendor.plan.expiresAt && new Date() > req.vendor.plan.expiresAt;

  if (expired && vendorPlan !== 'free') {
    req.vendor.plan.type = 'free';
  }

  if (plans[vendorPlan] >= plans[minPlan]) return next();
  res.status(403).json({ message: `This feature requires the ${minPlan} plan` });
};

const checkProductLimit = async (req, res, next) => {
  const limits = { free: 5, basic: 20, premium: Infinity };
  const plan = req.vendor.plan.type;
  const Product = require('../models/Product');
  const count = await Product.countDocuments({ vendorId: req.vendor._id });
  
  if (count >= limits[plan]) {
    return res.status(403).json({
      message: `Your ${plan} plan allows a maximum of ${limits[plan]} products. Upgrade to add more.`
    });
  }
  next();
};

const checkImageLimit = (req, res, next) => {
  const limits = { free: 1, basic: 3, premium: 3 };
  const plan = req.vendor.plan.type;
  
  if (req.files && req.files.length > limits[plan]) {
    return res.status(403).json({
      message: `Your ${plan} plan allows a maximum of ${limits[plan]} images per product.`
    });
  }
  next();
};

module.exports = { requirePlan, checkProductLimit, checkImageLimit };
