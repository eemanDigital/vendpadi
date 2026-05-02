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

exports.trackOrderByPhone = catchAsync(async (req, res) => {
  const { orderId, phone } = req.query;

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  let cleanId = orderId.trim();
  if (cleanId.length === 24) {
    // Full MongoDB ID
  } else if (/^[0-9a-fA-F]{8}$/.test(cleanId)) {
    // Short ID - need to search for it
    const allOrders = await Order.find({}).populate('vendorId', 'businessName slug phone');
    const found = allOrders.find(o => o._id.toString().slice(-8).toUpperCase() === cleanId.toUpperCase());
    
    if (!found) {
      return res.status(404).json({ message: 'Order not found. Please check your order ID.' });
    }

    if (phone && found.customerPhone !== phone.trim()) {
      return res.status(404).json({ message: 'Phone number does not match this order.' });
    }

    const statusMessages = {
      pending: 'Your order has been received and is being processed.',
      confirmed: 'Your order has been confirmed and is being prepared.',
      delivered: 'Your order has been delivered.',
      cancelled: 'Your order has been cancelled.'
    };

    return res.json({
      orderId: found._id,
      shortId: found._id.toString().slice(-8).toUpperCase(),
      customerName: found.customerName,
      customerPhone: found.customerPhone,
      items: found.items,
      totalAmount: found.totalAmount,
      status: found.status,
      statusMessage: statusMessages[found.status] || '',
      deliveryInfo: found.deliveryInfo,
      note: found.note,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
      vendor: found.vendorId ? {
        businessName: found.vendorId.businessName,
        phone: found.vendorId.phone
      } : null
    });
  } else {
    return res.status(400).json({ message: 'Invalid order ID format' });
  }

  const query = { _id: cleanId };
  if (phone) {
    query.customerPhone = phone.trim();
  }

  const order = await Order.findOne(query).populate('vendorId', 'businessName slug phone');

  if (!order) {
    return res.status(404).json({ 
      message: phone ? 'Order not found. Please check your order ID and phone number.' : 'Order not found.' 
    });
  }

  const statusMessages = {
    pending: 'Your order has been received and is being processed.',
    confirmed: 'Your order has been confirmed and is being prepared.',
    delivered: 'Your order has been delivered.',
    cancelled: 'Your order has been cancelled.'
  };

  res.json({
    orderId: order._id,
    shortId: order._id.toString().slice(-8).toUpperCase(),
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    items: order.items,
    totalAmount: order.totalAmount,
    status: order.status,
    statusMessage: statusMessages[order.status] || '',
    deliveryInfo: order.deliveryInfo,
    note: order.note,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    vendor: order.vendorId ? {
      businessName: order.vendorId.businessName,
      phone: order.vendorId.phone
    } : null
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
