const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.vendor._id })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, images, inStock, category } = req.body;

    const product = await Product.create({
      vendorId: req.vendor._id,
      name,
      description,
      price: Number(price),
      images: images || [],
      inStock: inStock !== false,
      category: category || ''
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.vendorId.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, price, images, inStock, category } = req.body;

    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (images !== undefined) product.images = images;
    if (inStock !== undefined) product.inStock = inStock;
    if (category !== undefined) product.category = category;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.vendorId.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.vendorId.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const limits = { free: 1, basic: 3, premium: 3 };
    const plan = req.vendor.plan.type;
    const maxImages = limits[plan];

    const newImages = req.files.map(f => f.path);
    const updatedImages = [...product.images, ...newImages].slice(0, maxImages);
    product.images = updatedImages;
    await product.save();

    res.json({ images: product.images });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
