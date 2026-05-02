const Wishlist = require('../models/Wishlist');
const Vendor = require('../models/Vendor');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.getWishlist = catchAsync(async (req, res) => {
  const { phone, storeSlug } = req.params;

  if (!phone || !storeSlug) {
    return res.status(400).json({ message: 'Phone and store slug are required' });
  }

  const vendor = await Vendor.findOne({ slug: storeSlug.toLowerCase(), isActive: true });
  if (!vendor) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const wishlist = await Wishlist.findOne({ phone: phone.trim(), storeSlug: storeSlug.toLowerCase() });

  res.json({
    items: wishlist ? wishlist.items : [],
    count: wishlist ? wishlist.items.length : 0
  });
});

exports.syncWishlist = catchAsync(async (req, res) => {
  const { phone, storeSlug, items } = req.body;

  if (!phone || !storeSlug || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Phone, store slug, and items array are required' });
  }

  const vendor = await Vendor.findOne({ slug: storeSlug.toLowerCase(), isActive: true });
  if (!vendor) {
    return res.status(404).json({ message: 'Store not found' });
  }

  let wishlist = await Wishlist.findOne({ phone: phone.trim(), storeSlug: storeSlug.toLowerCase() });

  if (wishlist) {
    const existingIds = new Set(wishlist.items.map(item => item.productId?.toString()));
    
    for (const item of items) {
      if (!existingIds.has(item._id?.toString() || item.productId?.toString())) {
        wishlist.items.push({
          productId: item._id || item.productId,
          name: item.name,
          price: item.price,
          images: item.images || [],
          category: item.category || '',
          addedAt: item.addedAt || new Date()
        });
      }
    }

    await wishlist.save();
  } else {
    wishlist = await Wishlist.create({
      phone: phone.trim(),
      storeSlug: storeSlug.toLowerCase(),
      items: items.map(item => ({
        productId: item._id || item.productId,
        name: item.name,
        price: item.price,
        images: item.images || [],
        category: item.category || '',
        addedAt: item.addedAt || new Date()
      }))
    });
  }

  res.json({
    message: 'Wishlist synced successfully',
    items: wishlist.items,
    count: wishlist.items.length
  });
});

exports.addItem = catchAsync(async (req, res) => {
  const { phone, storeSlug } = req.params;
  const { productId, name, price, images, category } = req.body;

  if (!phone || !storeSlug || !productId) {
    return res.status(400).json({ message: 'Phone, store slug, and productId are required' });
  }

  let wishlist = await Wishlist.findOne({ phone: phone.trim(), storeSlug: storeSlug.toLowerCase() });

  if (wishlist) {
    const exists = wishlist.items.some(item => item.productId?.toString() === productId);
    if (exists) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    wishlist.items.push({
      productId,
      name,
      price,
      images: images || [],
      category: category || ''
    });

    await wishlist.save();
  } else {
    wishlist = await Wishlist.create({
      phone: phone.trim(),
      storeSlug: storeSlug.toLowerCase(),
      items: [{
        productId,
        name,
        price,
        images: images || [],
        category: category || ''
      }]
    });
  }

  res.json({
    message: 'Item added to wishlist',
    items: wishlist.items,
    count: wishlist.items.length
  });
});

exports.removeItem = catchAsync(async (req, res) => {
  const { phone, storeSlug, productId } = req.params;

  if (!phone || !storeSlug || !productId) {
    return res.status(400).json({ message: 'Phone, store slug, and productId are required' });
  }

  const wishlist = await Wishlist.findOne({ phone: phone.trim(), storeSlug: storeSlug.toLowerCase() });

  if (!wishlist) {
    return res.status(404).json({ message: 'Wishlist not found' });
  }

  wishlist.items = wishlist.items.filter(item => item.productId?.toString() !== productId);
  await wishlist.save();

  res.json({
    message: 'Item removed from wishlist',
    items: wishlist.items,
    count: wishlist.items.length
  });
});

exports.toggleItem = catchAsync(async (req, res) => {
  const { phone, storeSlug } = req.params;
  const { productId, name, price, images, category } = req.body;

  if (!phone || !storeSlug || !productId) {
    return res.status(400).json({ message: 'Phone, store slug, and productId are required' });
  }

  let wishlist = await Wishlist.findOne({ phone: phone.trim(), storeSlug: storeSlug.toLowerCase() });

  if (wishlist) {
    const index = wishlist.items.findIndex(item => item.productId?.toString() === productId);
    if (index !== -1) {
      wishlist.items.splice(index, 1);
    } else {
      wishlist.items.push({
        productId,
        name,
        price,
        images: images || [],
        category: category || ''
      });
    }
    await wishlist.save();
  } else {
    wishlist = await Wishlist.create({
      phone: phone.trim(),
      storeSlug: storeSlug.toLowerCase(),
      items: [{
        productId,
        name,
        price,
        images: images || [],
        category: category || ''
      }]
    });
  }

  const isInWishlist = wishlist.items.some(item => item.productId?.toString() === productId);

  res.json({
    message: isInWishlist ? 'Item added to wishlist' : 'Item removed from wishlist',
    isInWishlist,
    items: wishlist.items,
    count: wishlist.items.length
  });
});

exports.clearWishlist = catchAsync(async (req, res) => {
  const { phone, storeSlug } = req.params;

  if (!phone || !storeSlug) {
    return res.status(400).json({ message: 'Phone and store slug are required' });
  }

  await Wishlist.findOneAndDelete({ phone: phone.trim(), storeSlug: storeSlug.toLowerCase() });

  res.json({
    message: 'Wishlist cleared',
    items: [],
    count: 0
  });
});
