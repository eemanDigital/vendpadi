const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.trackView = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const vendor = await Vendor.findOneAndUpdate(
    { slug: slug.toLowerCase() },
    { 
      $inc: { 'analytics.viewsCount': 1 },
      $set: { 'analytics.lastViewedAt': new Date() }
    },
    { new: true }
  );

  if (!vendor) {
    return res.status(404).json({ message: 'Store not found' });
  }

  res.json({ success: true });
});

exports.trackWhatsAppClick = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const { productIds } = req.body;

  const vendor = await Vendor.findOneAndUpdate(
    { slug: slug.toLowerCase() },
    { $inc: { 'analytics.whatsappClicks': 1 } },
    { new: true }
  );

  if (!vendor) {
    return res.status(404).json({ message: 'Store not found' });
  }

  if (productIds && Array.isArray(productIds) && productIds.length > 0) {
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $inc: { clickCount: 1 } }
    );
  }

  res.json({ success: true });
});

exports.trackProductView = catchAsync(async (req, res) => {
  const { slug, productId } = req.params;

  const vendor = await Vendor.findOne({ slug: slug.toLowerCase() });

  if (!vendor) {
    return res.status(404).json({ message: 'Store not found' });
  }

  await Product.findByIdAndUpdate(
    productId,
    { $inc: { viewCount: 1 } }
  );

  res.json({ success: true });
});

exports.getAnalytics = catchAsync(async (req, res) => {
  const vendorId = req.vendor._id;
  const vendor = await Vendor.findById(vendorId).select('analytics slug businessName plan');
  
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  const planType = vendor.plan?.type || 'free';
  const PLANS = { free: 0, starter: 1, business: 2, premium: 3 };
  const hasFullAnalytics = PLANS[planType] >= PLANS.business;
  const hasTopProducts = PLANS[planType] >= PLANS.business;

  let topProducts = [];
  let topProduct = null;
  let conversionRate = 0;

  if (hasFullAnalytics) {
    const products = await Product.find({ vendorId })
      .sort({ clickCount: -1 })
      .limit(5)
      .select('name clickCount images price');

    topProducts = products.map(p => ({
      id: p._id,
      name: p.name,
      clickCount: p.clickCount || 0,
      image: p.images?.[0] || null,
      price: p.price
    }));

    topProduct = topProducts.length > 0 ? topProducts[0] : null;

    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const viewsThisWeek = vendor.analytics.viewsCount;
    
    conversionRate = viewsThisWeek > 0 
      ? ((vendor.analytics.whatsappClicks / viewsThisWeek) * 100).toFixed(1)
      : 0;
  }

  const totalProducts = await Product.countDocuments({ vendorId });
  const storeUrl = `${req.protocol}://${req.get('host')}/store/${vendor.slug}`;

  res.json({
    level: planType,
    hasFullAnalytics,
    hasTopProducts,
    viewsCount: vendor.analytics.viewsCount || 0,
    whatsappClicks: vendor.analytics.whatsappClicks || 0,
    conversionRate: hasFullAnalytics ? parseFloat(conversionRate) : null,
    totalRevenue: vendor.analytics.totalRevenue || 0,
    topProducts: hasTopProducts ? topProducts : [],
    topProduct: hasTopProducts ? topProduct : null,
    totalProducts,
    storeUrl,
    businessName: vendor.businessName,
    lastViewedAt: vendor.analytics.lastViewedAt
  });
});
