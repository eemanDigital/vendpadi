const Order = require('../models/Order');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.getOrders = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status, startDate, endDate } = req.query;
  
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;
  
  const query = { vendorId: req.vendor._id };
  
  if (status) {
    query.status = status;
  }
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);
    
  res.json({
    orders,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  });
});

exports.getOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  const order = await Order.findOne({ _id: id, vendorId: req.vendor._id });
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
});

exports.updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const order = await Order.findOne({ _id: id, vendorId: req.vendor._id });
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const previousStatus = order.status;
  const revenueAdded = order.revenueAdded || false;
  order.status = status;
  
  if ((status === 'confirmed' || status === 'delivered') && !revenueAdded) {
    await Vendor.findByIdAndUpdate(req.vendor._id, {
      $inc: { 'analytics.totalRevenue': order.totalAmount }
    });
    order.revenueAdded = true;
  }

  if (status === 'cancelled' && revenueAdded) {
    await Vendor.findByIdAndUpdate(req.vendor._id, {
      $inc: { 'analytics.totalRevenue': -order.totalAmount }
    });
    order.revenueAdded = false;
  }

  await order.save();

  if ((status === 'confirmed' || status === 'delivered') && previousStatus !== 'confirmed' && previousStatus !== 'delivered') {
    for (const item of order.items) {
      if (item.productId) {
        const product = await Product.findById(item.productId);
        if (product && product.stock >= item.qty) {
          const newStock = product.stock - item.qty;
          await Product.findByIdAndUpdate(item.productId, {
            stock: newStock,
            inStock: newStock > 0
          });
        }
      }
    }
    order.stockReduced = true;
    await order.save();
  }

  if (status === 'cancelled' && order.stockReduced) {
    for (const item of order.items) {
      if (item.productId) {
        const product = await Product.findById(item.productId);
        if (product) {
          const newStock = product.stock + item.qty;
          await Product.findByIdAndUpdate(item.productId, {
            stock: newStock,
            inStock: true
          });
        }
      }
    }
    order.stockReduced = false;
    await order.save();
  }
  
  const updatedVendor = await Vendor.findById(req.vendor._id);
  
  res.json({ 
    ...order.toObject(),
    analytics: updatedVendor.analytics
  });
});

exports.getOrderStats = catchAsync(async (req, res) => {
  const vendorId = req.vendor._id;
  
  const totalOrders = await Order.countDocuments({ vendorId });
  const pendingOrders = await Order.countDocuments({ vendorId, status: 'pending' });
  const confirmedOrders = await Order.countDocuments({ vendorId, status: 'confirmed' });
  const deliveredOrders = await Order.countDocuments({ vendorId, status: 'delivered' });
  const cancelledOrders = await Order.countDocuments({ vendorId, status: 'cancelled' });
  
  const vendor = await Vendor.findById(vendorId).select('analytics');
  const totalRevenue = vendor?.analytics?.totalRevenue || 0;

  const recentOrders = await Order.find({ vendorId })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalOrders,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
    recentOrders
  });
});
