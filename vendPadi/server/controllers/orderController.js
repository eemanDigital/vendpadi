const Order = require('../models/Order');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.getOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ vendorId: req.vendor._id })
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(orders);
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
  order.status = status;
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
  
  res.json(order);
});

exports.getOrderStats = catchAsync(async (req, res) => {
  const vendorId = req.vendor._id;
  
  const totalOrders = await Order.countDocuments({ vendorId });
  const pendingOrders = await Order.countDocuments({ vendorId, status: 'pending' });
  const confirmedOrders = await Order.countDocuments({ vendorId, status: 'confirmed' });
  const deliveredOrders = await Order.countDocuments({ vendorId, status: 'delivered' });
  
  const totalRevenue = await Order.aggregate([
    { $match: { vendorId, status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  const recentOrders = await Order.find({ vendorId })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalOrders,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    recentOrders
  });
});
