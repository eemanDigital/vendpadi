const { uploadProduct, uploadLogo } = require('../config/cloudinary');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const handleUpload = (uploadFn) => catchAsync(async (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: 'Too many files. Maximum 3 images allowed.' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB per image.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Unexpected file field.' });
      }
      
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }
    next();
  });
});

const uploadProductImages = handleUpload(uploadProduct.array('images', 3));
const uploadVendorLogo = handleUpload(uploadLogo.single('logo'));

module.exports = {
  uploadProductImages,
  uploadVendorLogo
};
