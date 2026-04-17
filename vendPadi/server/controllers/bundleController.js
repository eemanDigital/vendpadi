const Bundle = require('../models/Bundle');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.getBundles = catchAsync(async (req, res) => {
  const { vendorId } = req.params;
  
  const bundles = await Bundle.find({ 
    vendorId, 
    isActive: true 
  }).sort({ createdAt: -1 });

  res.json({ bundles });
});

exports.getMyBundles = catchAsync(async (req, res) => {
  const bundles = await Bundle.find({ 
    vendorId: req.vendor._id 
  }).sort({ createdAt: -1 });

  res.json({ bundles });
});

exports.getBundle = catchAsync(async (req, res) => {
  const bundle = await Bundle.findOne({ 
    _id: req.params.id,
    isActive: true
  });

  if (!bundle) {
    return res.status(404).json({ message: 'Bundle not found' });
  }

  res.json({ bundle });
});

exports.createBundle = catchAsync(async (req, res) => {
  const { name, description, productIds, bundlePrice, isDealOfTheDay, dealEndTime } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Bundle name is required' });
  }

  if (!productIds || productIds.length < 2) {
    return res.status(400).json({ message: 'Bundle must include at least 2 products' });
  }

  if (!bundlePrice || bundlePrice <= 0) {
    return res.status(400).json({ message: 'Bundle price must be greater than 0' });
  }

  const products = await Product.find({ 
    _id: { $in: productIds },
    vendorId: req.vendor._id
  });

  if (products.length < 2) {
    return res.status(400).json({ message: 'Invalid products selected' });
  }

  const originalPrice = products.reduce((sum, p) => sum + p.price, 0);

  const bundleItems = products.map(p => ({
    productId: p._id,
    name: p.name,
    price: p.price,
    image: p.images?.[0] || ''
  }));

  const bundle = new Bundle({
    vendorId: req.vendor._id,
    name: name.trim(),
    description: description?.trim() || '',
    products: bundleItems,
    originalPrice,
    bundlePrice,
    image: products[0]?.images?.[0] || '',
    isDealOfTheDay: Boolean(isDealOfTheDay),
    dealStartTime: isDealOfTheDay ? new Date() : null,
    dealEndTime: isDealOfTheDay && dealEndTime ? new Date(dealEndTime) : null
  });

  await bundle.save();

  res.status(201).json({ bundle });
});

exports.updateBundle = catchAsync(async (req, res) => {
  const { name, description, bundlePrice, isDealOfTheDay, dealEndTime, isActive } = req.body;

  const bundle = await Bundle.findOne({ 
    _id: req.params.id,
    vendorId: req.vendor._id
  });

  if (!bundle) {
    return res.status(404).json({ message: 'Bundle not found' });
  }

  if (name) bundle.name = name.trim();
  if (description !== undefined) bundle.description = description.trim();
  if (bundlePrice) bundle.bundlePrice = bundlePrice;
  if (isDealOfTheDay !== undefined) {
    bundle.isDealOfTheDay = isDealOfTheDay;
    if (isDealOfTheDay && !bundle.dealStartTime) {
      bundle.dealStartTime = new Date();
    }
  }
  if (dealEndTime !== undefined) {
    bundle.dealEndTime = dealEndTime ? new Date(dealEndTime) : null;
  }
  if (isActive !== undefined) {
    bundle.isActive = isActive;
  }

  await bundle.save();

  res.json({ bundle });
});

exports.deleteBundle = catchAsync(async (req, res) => {
  const bundle = await Bundle.findOneAndDelete({ 
    _id: req.params.id,
    vendorId: req.vendor._id
  });

  if (!bundle) {
    return res.status(404).json({ message: 'Bundle not found' });
  }

  res.json({ message: 'Bundle deleted successfully' });
});

exports.getDealOfTheDay = catchAsync(async (req, res) => {
  const { vendorId } = req.params;
  
  const deal = await Bundle.findOne({ 
    vendorId, 
    isActive: true,
    isDealOfTheDay: true
  }).sort({ createdAt: -1 });

  res.json({ deal });
});
