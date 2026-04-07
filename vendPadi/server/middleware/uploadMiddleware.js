const { uploadProduct, uploadLogo } = require('../config/cloudinary');

const uploadProductImages = uploadProduct.array('images', 3);
const uploadVendorLogo = uploadLogo.single('logo');

const handleUpload = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: 'Too many files. Maximum 3 images allowed.' });
      }
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    next();
  });
};

module.exports = {
  uploadProductImages: handleUpload(uploadProduct),
  uploadVendorLogo: handleUpload(uploadLogo)
};
