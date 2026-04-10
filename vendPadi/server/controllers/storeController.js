const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { sendOrderNotificationEmail } = require('../utils/email');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.getStore = catchAsync(async (req, res) => {
  const { slug } = req.params;

  if (!slug || slug.trim() === '') {
    return res.status(400).json({ message: 'Store slug is required' });
  }

  const vendor = await Vendor.findOne({ slug: slug.toLowerCase(), isActive: true })
    .select('-passwordHash -email');

  if (!vendor) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const products = await Product.find({ 
    vendorId: vendor._id, 
    inStock: true 
  }).sort({ createdAt: -1 });

  res.json({
    vendor,
    products
  });
});

exports.createOrder = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const { items, totalAmount, customerName, customerPhone, note } = req.body;

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

  const order = await Order.create({
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
  });

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
