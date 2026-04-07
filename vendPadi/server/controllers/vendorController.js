const Vendor = require('../models/Vendor');

exports.getMe = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor._id).select('-passwordHash');
    res.json(vendor);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { businessName, description, phone, category } = req.body;

    const vendor = await Vendor.findById(req.vendor._id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    if (businessName) vendor.businessName = businessName;
    if (description !== undefined) vendor.description = description;
    if (phone) vendor.phone = phone;
    if (category) vendor.category = category;

    await vendor.save();

    res.json({
      _id: vendor._id,
      businessName: vendor.businessName,
      slug: vendor.slug,
      email: vendor.email,
      phone: vendor.phone,
      category: vendor.category,
      plan: vendor.plan,
      logo: vendor.logo,
      description: vendor.description
    });
  } catch (error) {
    console.error('Update me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const vendor = await Vendor.findById(req.vendor._id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    vendor.logo = req.file.path;
    await vendor.save();

    res.json({ logo: vendor.logo });
  } catch (error) {
    console.error('Update logo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
