const Vendor = require('../models/Vendor');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.getMe = catchAsync(async (req, res) => {
  const vendor = await Vendor.findById(req.vendor._id).select('-passwordHash');
  
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  res.json(vendor);
});

exports.updateMe = catchAsync(async (req, res) => {
  const { businessName, description, phone, category } = req.body;

  const vendor = await Vendor.findById(req.vendor._id);
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  if (businessName !== undefined) {
    if (!businessName.trim()) {
      return res.status(400).json({ message: 'Business name cannot be empty' });
    }
    vendor.businessName = businessName.trim();
  }

  if (description !== undefined) {
    vendor.description = description.trim();
  }

  if (phone !== undefined) {
    if (!phone.trim()) {
      return res.status(400).json({ message: 'Phone number cannot be empty' });
    }
    vendor.phone = phone.trim();
  }

  if (category !== undefined) {
    if (category.trim()) {
      vendor.category = category.toLowerCase().trim();
    }
  }

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
    coverImage: vendor.coverImage,
    customLink: vendor.customLink,
    description: vendor.description,
    isAdmin: vendor.isAdmin
  });
});

exports.updateLogo = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  const vendor = await Vendor.findById(req.vendor._id);
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedFormats.includes(req.file.mimetype)) {
    return res.status(400).json({ message: 'Only JPG, PNG, and WebP images are allowed' });
  }

  const maxSize = 2 * 1024 * 1024;
  if (req.file.size > maxSize) {
    return res.status(400).json({ message: 'Image size must be less than 2MB' });
  }

  vendor.logo = req.file.path;
  await vendor.save();

  res.json({ 
    logo: vendor.logo,
    message: 'Logo updated successfully'
  });
});

exports.updateCoverImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  const vendor = await Vendor.findById(req.vendor._id);
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedFormats.includes(req.file.mimetype)) {
    return res.status(400).json({ message: 'Only JPG, PNG, and WebP images are allowed' });
  }

  const maxSize = 5 * 1024 * 1024;
  if (req.file.size > maxSize) {
    return res.status(400).json({ message: 'Image size must be less than 5MB' });
  }

  vendor.coverImage = req.file.path;
  await vendor.save();

  res.json({ 
    coverImage: vendor.coverImage,
    message: 'Cover image updated successfully'
  });
});

exports.updateCustomLink = catchAsync(async (req, res) => {
  const { customLink } = req.body;
  const vendor = await Vendor.findById(req.vendor._id);
  
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  if (!customLink || !customLink.trim()) {
    return res.status(400).json({ message: 'Custom link is required' });
  }

  const link = customLink.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  
  if (link.length < 3 || link.length > 50) {
    return res.status(400).json({ message: 'Custom link must be 3-50 characters' });
  }

  if (!/^[a-z0-9-]+$/.test(link)) {
    return res.status(400).json({ message: 'Only letters, numbers, and hyphens allowed' });
  }

  const existing = await Vendor.findOne({ 
    customLink: link, 
    _id: { $ne: vendor._id } 
  });
  
  if (existing) {
    return res.status(400).json({ message: 'This custom link is already taken' });
  }

  vendor.customLink = link;
  await vendor.save();

  res.json({ 
    customLink: vendor.customLink,
    message: 'Custom link updated successfully'
  });
});
