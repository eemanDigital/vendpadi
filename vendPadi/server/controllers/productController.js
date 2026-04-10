const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const deleteImagesFromCloudinary = async (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) return;
  
  const deletePromises = images.map(async (imageUrl) => {
    try {
      if (imageUrl && imageUrl.includes('cloudinary.com')) {
        const publicIdMatch = imageUrl.match(/\/upload\/(.+)\.[a-z]+$/i);
        if (publicIdMatch && publicIdMatch[1]) {
          await cloudinary.uploader.destroy(publicIdMatch[1]);
        }
      }
    } catch (err) {
      console.error('Failed to delete image from Cloudinary:', err.message);
    }
  });
  
  await Promise.allSettled(deletePromises);
};

exports.getProducts = catchAsync(async (req, res) => {
  const products = await Product.find({ vendorId: req.vendor._id })
    .sort({ createdAt: -1 });
  res.json(products);
});

exports.createProduct = catchAsync(async (req, res) => {
  const { name, description, price, images, inStock, category } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Product name is required' });
  }

  if (price === undefined || price === null || isNaN(Number(price))) {
    return res.status(400).json({ message: 'Valid price is required' });
  }

  if (Number(price) < 0) {
    return res.status(400).json({ message: 'Price cannot be negative' });
  }

  const product = await Product.create({
    vendorId: req.vendor._id,
    name: name.trim(),
    description: description?.trim() || '',
    price: Number(price),
    images: Array.isArray(images) ? images : [],
    inStock: inStock !== false,
    category: category?.trim() || ''
  });

  res.status(201).json(product);
});

exports.updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  const product = await Product.findById(id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.vendorId.toString() !== req.vendor._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this product' });
  }

  const { name, description, price, images, inStock, category } = req.body;

  if (name !== undefined) {
    if (!name.trim()) {
      return res.status(400).json({ message: 'Product name cannot be empty' });
    }
    product.name = name.trim();
  }
  
  if (description !== undefined) product.description = description.trim();
  
  if (price !== undefined) {
    if (isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ message: 'Invalid price value' });
    }
    product.price = Number(price);
  }
  
  if (images !== undefined) {
    if (!Array.isArray(images)) {
      return res.status(400).json({ message: 'Images must be an array' });
    }
    product.images = images;
  }
  
  if (inStock !== undefined) product.inStock = inStock;
  if (category !== undefined) product.category = category.trim();

  await product.save();
  res.json(product);
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  const product = await Product.findById(id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.vendorId.toString() !== req.vendor._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this product' });
  }

  await deleteImagesFromCloudinary(product.images);
  await Product.findByIdAndDelete(id);
  res.json({ message: 'Product deleted successfully' });
});

exports.uploadImages = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images uploaded' });
  }

  const product = await Product.findById(id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.vendorId.toString() !== req.vendor._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const limits = { free: 2, starter: 4, business: 6, premium: 8 };
  const plan = req.vendor.plan?.type || 'free';
  const maxImages = limits[plan] || 2;

  const totalAfterUpload = product.images.length + req.files.length;
  if (totalAfterUpload > maxImages) {
    return res.status(400).json({ 
      message: `Your ${plan} plan allows maximum ${maxImages} images. Please delete some images first.`
    });
  }

  const newImages = req.files.map(f => f.path);
  const updatedImages = [...product.images, ...newImages].slice(0, maxImages);
  product.images = updatedImages;
  await product.save();

  res.json({ images: product.images, message: 'Images uploaded successfully' });
});

exports.uploadImagesStandalone = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images uploaded' });
  }

  const images = req.files.map(f => f.path);
  res.json({ images, message: 'Images uploaded successfully' });
});
