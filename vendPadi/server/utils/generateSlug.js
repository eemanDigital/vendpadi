const Vendor = require('../models/Vendor');

const generateSlug = async (businessName) => {
  const base = businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');

  let slug = base;
  let count = 1;

  while (await Vendor.findOne({ slug })) {
    slug = `${base}-${count++}`;
  }
  return slug;
};

module.exports = generateSlug;
