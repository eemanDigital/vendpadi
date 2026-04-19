const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Bundle = require('../models/Bundle');
const Order = require('../models/Order');
const { sendOrderNotificationEmail } = require('../utils/email');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const LOW_STOCK_THRESHOLDS = {
  free: 10,
  starter: 8,
  business: 5,
  premium: 3
};

exports.getStore = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const { page = 1, limit = 20 } = req.query;

  if (!slug || slug.trim() === '') {
    return res.status(400).json({ message: 'Store slug is required' });
  }

  const vendor = await Vendor.findOne({ slug: slug.toLowerCase(), isActive: true })
    .select('-passwordHash -email');

  if (!vendor) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const query = { vendorId: vendor._id, inStock: true };
  const totalProducts = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const bundles = await Bundle.find({ vendorId: vendor._id, isActive: true })
    .sort({ createdAt: -1 });

  const planType = vendor.plan?.type || 'free';
  const defaultThreshold = LOW_STOCK_THRESHOLDS[planType] || 10;

  const productsWithAlerts = products.map(p => {
    const threshold = p.lowStockThreshold || defaultThreshold;
    return {
      ...p.toObject(),
      lowStockAlert: p.stock > 0 && p.stock <= threshold
    };
  });

  res.json({
    vendor,
    products: productsWithAlerts,
    bundles,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: totalProducts,
      totalPages: Math.ceil(totalProducts / limitNum)
    }
  });
});

exports.createOrder = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const { items, totalAmount, customerName, customerPhone, note, deliveryInfo } = req.body;

  if (!slug || slug.trim() === '') {
    return res.status(400).json({ message: 'Store slug is required' });
  }

  const vendor = await Vendor.findOne({ slug: slug.toLowerCase(), isActive: true });
  if (!vendor) {
    return res.status(404).json({ message: 'Store not found or unavailable' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item' });
  }

  if (totalAmount === undefined || isNaN(Number(totalAmount)) || Number(totalAmount) < 0) {
    return res.status(400).json({ message: 'Invalid total amount' });
  }

  for (const item of items) {
    if (!item.name || item.price === undefined || item.qty < 1) {
      return res.status(400).json({ message: 'Invalid item data in order' });
    }
  }

  const insufficientStock = [];
  for (const item of items) {
    if (item.productId) {
      const product = await Product.findById(item.productId);
      if (product && product.stock < item.qty) {
        insufficientStock.push({
          name: item.name,
          requested: item.qty,
          available: product.stock
        });
      }
    }
  }

  if (insufficientStock.length > 0) {
    return res.status(400).json({
      message: 'Insufficient stock for some items',
      insufficientStock
    });
  }

  const orderData = {
    vendorId: vendor._id,
    items: items.map(item => ({
      productId: item.productId || null,
      name: item.name,
      price: Number(item.price),
      qty: Math.max(1, Number(item.qty)),
      isBundle: item.isBundle === true,
      bundleId: item.bundleId || null,
      isFlashSale: item.isFlashSale === true,
      originalPrice: item.originalPrice ? Number(item.originalPrice) : null
    })),
    totalAmount: Number(totalAmount),
    customerName: customerName?.trim() || 'Anonymous',
    customerPhone: customerPhone?.trim() || '',
    note: note?.trim() || ''
  };

  if (deliveryInfo && deliveryInfo.zone) {
    orderData.deliveryInfo = {
      zone: deliveryInfo.zone,
      fee: Number(deliveryInfo.fee) || 0,
      estimatedDays: deliveryInfo.estimatedDays || null
    };
  }

  console.log('Creating order with data:', JSON.stringify(orderData));

  const order = await Order.create(orderData);

  sendOrderNotificationEmail(vendor.email, vendor.businessName, {
    customerName: customerName || 'Anonymous',
    items: order.items,
    total: totalAmount,
    orderId: order._id.toString(),
    date: new Date(order.createdAt).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }).catch(err => console.error('Failed to send order email:', err));

  res.status(201).json({ 
    message: 'Order created successfully',
    order 
  });
});

exports.getStoreByCustomLink = catchAsync(async (req, res) => {
  const { customLink } = req.params;

  if (!customLink || customLink.trim() === '') {
    return res.status(400).json({ message: 'Custom link is required' });
  }

  const vendor = await Vendor.findOne({ customLink: customLink.toLowerCase(), isActive: true })
    .select('-passwordHash -email');

  if (!vendor) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const products = await Product.find({ vendorId: vendor._id })
    .sort({ createdAt: -1 });

  const bundles = await Bundle.find({ vendorId: vendor._id, isActive: true })
    .sort({ createdAt: -1 });

  const planType = vendor.plan?.type || 'free';
  const defaultThreshold = LOW_STOCK_THRESHOLDS[planType] || 10;

  const productsWithAlerts = products.map(p => {
    const threshold = p.lowStockThreshold || defaultThreshold;
    return {
      ...p.toObject(),
      lowStockAlert: p.stock > 0 && p.stock <= threshold
    };
  });

  res.json({
    vendor,
    products: productsWithAlerts,
    bundles
  });
});

exports.createOrderByCustomLink = catchAsync(async (req, res) => {
  const { customLink } = req.params;
  const { items, totalAmount, customerName, customerPhone, note, deliveryInfo } = req.body;

  if (!customLink || customLink.trim() === '') {
    return res.status(400).json({ message: 'Custom link is required' });
  }

  const vendor = await Vendor.findOne({ customLink: customLink.toLowerCase(), isActive: true });
  if (!vendor) {
    return res.status(404).json({ message: 'Store not found or unavailable' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item' });
  }

  if (totalAmount === undefined || isNaN(Number(totalAmount)) || Number(totalAmount) < 0) {
    return res.status(400).json({ message: 'Invalid total amount' });
  }

  const insufficientStock = [];
  for (const item of items) {
    if (item.productId) {
      const product = await Product.findById(item.productId);
      if (product && product.stock < item.qty) {
        insufficientStock.push({
          name: item.name,
          requested: item.qty,
          available: product.stock
        });
      }
    }
  }

  if (insufficientStock.length > 0) {
    return res.status(400).json({
      message: 'Insufficient stock for some items',
      insufficientStock
    });
  }

  const orderData = {
    vendorId: vendor._id,
    items: items.map(item => ({
      productId: item.productId || null,
      name: item.name,
      price: Number(item.price),
      qty: Math.max(1, Number(item.qty))
    })),
    totalAmount: Number(totalAmount),
    customerName: customerName?.trim() || 'Anonymous',
    customerPhone: customerPhone?.trim() || '',
    note: note?.trim() || ''
  };

  if (deliveryInfo && deliveryInfo.zone) {
    orderData.deliveryInfo = {
      zone: deliveryInfo.zone,
      fee: Number(deliveryInfo.fee) || 0,
      estimatedDays: deliveryInfo.estimatedDays || null
    };
  }

  const order = await Order.create(orderData);

  sendOrderNotificationEmail(vendor.email, vendor.businessName, {
    customerName: customerName || 'Anonymous',
    items: order.items,
    total: totalAmount,
    orderId: order._id.toString(),
    date: new Date(order.createdAt).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }).catch(err => console.error('Failed to send order email:', err));

  res.status(201).json({ 
    message: 'Order created successfully',
    order 
  });
});
