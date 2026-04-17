const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'vendpadi/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit', quality: 'auto', format: 'webp' }
    ]
  }
});

const productThumbnailStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'vendpadi/products/thumbnails',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 100, height: 100, crop: 'fill', quality: 60, format: 'webp' }
    ]
  }
});

const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'vendpadi/logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 200, height: 200, crop: 'fill', quality: 'auto', format: 'webp' }
    ]
  }
});

const coverStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'vendpadi/covers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 400, crop: 'fill', quality: 'auto', format: 'webp' }
    ]
  }
});

const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'vendpadi/documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
    resource_type: 'auto'
  }
});

const uploadProduct = multer({ 
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadLogo = multer({ 
  storage: logoStorage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

const uploadCover = multer({ 
  storage: coverStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadDoc = multer({ 
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = { 
  cloudinary, 
  uploadProduct, 
  uploadLogo, 
  uploadCover, 
  uploadDoc 
};
