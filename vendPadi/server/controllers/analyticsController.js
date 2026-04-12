const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const VIEW_COOLDOWN_MS = 30 * 60 * 1000;
const recentViews = new Map();

setInterval(() => {
  const now = Date.now();
  const cutoff = now - VIEW_COOLDOWN_MS;
  let deleted = 0;
  for (const [key, timestamp] of recentViews) {
    if (timestamp < cutoff) {
      recentViews.delete(key);
      deleted++;
    }
  }
  if (deleted > 0) {
    console.log(`Cleaned up ${deleted} expired view records. Remaining: ${recentViews.size}`);
  }
}, 10 * 60 * 1000);

exports.trackView = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const cacheKey = `${slug}:${clientIp}`;

  const now = Date.now();
  const lastView = recentViews.get(cacheKey);
  
  if (lastView && (now - lastView) < VIEW_COOLDOWN_MS) {
    return res.json({ success: true, message: 'View already counted' });
  }

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

  recentViews.set(cacheKey, now);
  res.json({ success: true });
});

exports.trackWhatsAppClick = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const { productIds } = req.body;

  const vendor = await Vendor.findOneAndUpdate(
    { slug: slug.toLowerCase() },
    { $inc: { 'analytics.whatsappClicks': 1 } },
    { new: true, select: '_id' }
  );

  if (!vendor) {
    return res.status(404).json({ message: 'Store not found' });
  }

  if (productIds && Array.isArray(productIds) && productIds.length > 0) {
    await Product.updateMany(
      { _id: { $in: productIds }, vendorId: vendor._id },
      { $inc: { clickCount: 1 } }
    );
  }

  res.json({ success: true });
});

exports.trackProductView = catchAsync(async (req, res) => {
  const { slug, productId } = req.params;

  const vendor = await Vendor.findOne({ slug: slug.toLowerCase() }).select('_id');

  if (!vendor) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const product = await Product.findOneAndUpdate(
    { _id: productId, vendorId: vendor._id },
    { $inc: { viewCount: 1 } }
  );

  if (!product) {
    return res.status(404).json({ message: 'Product not found in this store' });
  }

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
      .select('name clickCount viewCount images price');

    topProducts = products.map(p => ({
      id: p._id,
      name: p.name,
      clickCount: p.clickCount || 0,
      viewCount: p.viewCount || 0,
      image: p.images?.[0] || null,
      price: p.price
    }));

    topProduct = topProducts.length > 0 ? topProducts[0] : null;

    const viewsThisWeek = vendor.analytics.viewsCount || 0;
    const clicks = vendor.analytics.whatsappClicks || 0;
    
    const rawRate = viewsThisWeek > 0 ? (clicks / viewsThisWeek) * 100 : 0;
    conversionRate = Math.min(rawRate, 100).toFixed(1);
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
