const { uploadProduct, uploadLogo, uploadCover } = require('../config/cloudinary');

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const validateFile = (file) => {
  if (!file) return null;
  if (!IMAGE_TYPES.includes(file.mimetype)) {
    return new Error(`Invalid file type: ${file.mimetype}. Allowed: JPG, PNG, WebP, GIF`);
  }
  if (file.size > MAX_FILE_SIZE) {
    return new Error('File too large. Maximum size is 5MB per image.');
  }
  return null;
};

const handleUpload = (uploadFn) => catchAsync(async (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: 'Too many files. Maximum 8 images allowed.' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB per image.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Unexpected file field.' });
      }
      
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }

    if (req.files) {
      for (const file of req.files) {
        const validationError = validateFile(file);
        if (validationError) {
          return res.status(400).json({ message: validationError.message });
        }
      }
    }
    if (req.file) {
      const validationError = validateFile(req.file);
      if (validationError) {
        return res.status(400).json({ message: validationError.message });
      }
    }
    
    next();
  });
});

const uploadProductImages = handleUpload(uploadProduct.array('images', 8));
const uploadVendorLogo = handleUpload(uploadLogo.single('logo'));
const uploadCoverImage = handleUpload(uploadCover.single('coverImage'));

module.exports = {
  uploadProductImages,
  uploadVendorLogo,
  uploadCoverImage
};
