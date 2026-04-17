const Vendor = require('../models/Vendor');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.getMe = catchAsync(async (req, res) => {
  const vendor = await Vendor.findById(req.vendor._id).select('-passwordHash');
  
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  vendor.checkTrialExpired();
  await vendor.save();

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
    trial: vendor.trial,
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

exports.submitVerification = catchAsync(async (req, res) => {
  const { documentType } = req.body;
  const vendor = await Vendor.findById(req.vendor._id);
  
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  if (vendor.verification.isVerified) {
    return res.status(400).json({ message: 'Your business is already verified' });
  }

  if (vendor.verification.status === 'pending') {
    return res.status(400).json({ message: 'Verification is already pending review' });
  }

  if (!documentType || !['cac', 'nin', 'passport', 'drivers_license'].includes(documentType)) {
    return res.status(400).json({ message: 'Invalid document type' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Document image is required' });
  }

  const allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowedFormats.includes(req.file.mimetype)) {
    return res.status(400).json({ message: 'Only JPG, PNG, WebP, and PDF files are allowed' });
  }

  const maxSize = 10 * 1024 * 1024;
  if (req.file.size > maxSize) {
    return res.status(400).json({ message: 'File size must be less than 10MB' });
  }

  vendor.verification = {
    isVerified: false,
    status: 'pending',
    documentType,
    documentUrl: req.file.path,
    submittedAt: new Date(),
    reviewedAt: null,
    rejectionReason: ''
  };

  await vendor.save();

  res.json({
    verification: vendor.verification,
    message: 'Verification documents submitted successfully. You will be notified once reviewed.'
  });
});

exports.updateDeliveryZones = catchAsync(async (req, res) => {
  const { enabled, defaultZone, zones } = req.body;
  const vendor = await Vendor.findById(req.vendor._id);
  
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  if (enabled !== undefined) {
    vendor.deliveryZones.enabled = Boolean(enabled);
  }

  if (defaultZone !== undefined) {
    vendor.deliveryZones.defaultZone = defaultZone;
  }

  if (zones !== undefined && Array.isArray(zones)) {
    const validZones = zones.filter(z => z.name && z.name.trim()).map(z => ({
      name: z.name.trim(),
      fee: Number(z.fee) || 0,
      estimatedDays: z.estimatedDays || '1-2 days',
      isActive: Boolean(z.isActive)
    }));
    vendor.deliveryZones.zones = validZones;
  }

  await vendor.save();

  res.json({
    deliveryZones: vendor.deliveryZones,
    message: 'Delivery zones updated successfully'
  });
});

exports.getDeliveryZones = catchAsync(async (req, res) => {
  const vendor = await Vendor.findById(req.vendor._id).select('deliveryZones');
  
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  res.json({
    deliveryZones: vendor.deliveryZones
  });
});
