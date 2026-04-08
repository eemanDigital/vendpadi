require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');
const storeRoutes = require('./routes/storeRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const today = new Date().toISOString().split('T')[0];
const logStream = fs.createWriteStream(
  path.join(logsDir, `server-${today}.log`),
  { flags: 'a' }
);

const log = {
  info: (message, ...args) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [INFO] ${message} ${args.length ? JSON.stringify(args) : ''}`;
    console.log(logEntry);
    logStream.write(logEntry + '\n');
  },
  error: (message, error, ...meta) => {
    const timestamp = new Date().toISOString();
    const stack = error?.stack || error?.message || String(error);
    const logEntry = `[${timestamp}] [ERROR] ${message}\n  Stack: ${stack} ${meta.length ? '\n  Meta: ' + JSON.stringify(meta) : ''}`;
    console.error(logEntry);
    logStream.write(logEntry + '\n');
  },
  warn: (message, ...meta) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [WARN] ${message} ${meta.length ? JSON.stringify(meta) : ''}`;
    console.warn(logEntry);
    logStream.write(logEntry + '\n');
  },
  http: (method, path, status, duration) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [HTTP] ${method} ${path} ${status} ${duration}ms`;
    console.log(logEntry);
    logStream.write(logEntry + '\n');
  }
};

log.info('Starting VendPadi server...');

process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: 'Too many authentication attempts, please try again later.' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    log.http(req.method, req.path, res.statusCode, duration);
  });
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((err, req, res, next) => {
  log.error('Unhandled error', err, {
    method: req.method,
    path: req.path,
    ip: req.ip
  });

  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({ message: `${field} already exists` });
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({ 
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  log.warn(`404 Not Found: ${req.method} ${req.path}`, { ip: req.ip });
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  log.info(`Server running on port ${PORT}`);
  log.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
