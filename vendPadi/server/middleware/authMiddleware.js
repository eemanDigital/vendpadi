const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Invalid token format.' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured on server');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    
    const vendor = await Vendor.findById(decoded.id).select('-passwordHash');
    
    if (!vendor) {
      return res.status(401).json({ message: 'Vendor account not found' });
    }

    if (vendor.deletedAt) {
      return res.status(403).json({ 
        message: 'Account has been deleted',
        code: 'ACCOUNT_DELETED'
      });
    }

    if (!vendor.isActive) {
      return res.status(403).json({ message: 'Account has been deactivated' });
    }

    req.vendor = vendor;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    throw error;
  }
});

const adminOnly = catchAsync(async (req, res, next) => {
  if (!req.vendor?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
});

module.exports = { protect, adminOnly };
