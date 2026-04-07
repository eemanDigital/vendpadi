const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getStore = async (req, res) => {
  try {
    const { slug } = req.params;

    const vendor = await Vendor.findOne({ slug, isActive: true })
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
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { slug } = req.params;
    const { items, totalAmount, customerName, customerPhone, note } = req.body;

    const vendor = await Vendor.findOne({ slug, isActive: true });
    if (!vendor) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const order = await Order.create({
      vendorId: vendor._id,
      items,
      totalAmount,
      customerName: customerName || 'Anonymous',
      customerPhone: customerPhone || '',
      note: note || ''
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
