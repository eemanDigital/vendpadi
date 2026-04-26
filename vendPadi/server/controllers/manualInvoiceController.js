const ManualInvoice = require('../models/ManualInvoice');
const Vendor = require('../models/Vendor');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const generateInvoiceNumber = async (vendorId, type) => {
  const prefix = type === 'invoice' ? 'INV' : 'RCP';
  
  for (let attempt = 0; attempt < 10; attempt++) {
    const vendor = await Vendor.findById(vendorId).select('slug');
    const vendorPrefix = vendor?.slug?.toUpperCase()?.replace(/[^A-Z]/g, '').slice(0, 4) || 'DOC';
    
    const count = await ManualInvoice.countDocuments({ vendorId });
    const year = new Date().getFullYear();
    const seq = String(count + attempt + 1).padStart(5, '0');
    
    const invoiceNumber = `${vendorPrefix}-${year}-${seq}`;
    
    const existing = await ManualInvoice.findOne({ vendorId, invoiceNumber });
    if (!existing) {
      return invoiceNumber;
    }
  }
  
  const timestamp = Date.now().toString(36);
  return `${prefix}-${timestamp}`;
};

exports.getInvoices = catchAsync(async (req, res) => {
  const vendorId = req.vendor._id;
  const { page = 1, limit = 20, type, status, search, startDate, endDate } = req.query;

  const query = { vendorId };
  
  if (type) query.type = type;
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  if (search) {
    query.$or = [
      { invoiceNumber: { $regex: search, $options: 'i' } },
      { 'customer.name': { $regex: search, $options: 'i' } },
      { 'customer.phone': { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [invoices, total] = await Promise.all([
    ManualInvoice.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    ManualInvoice.countDocuments(query)
  ]);

  const stats = await ManualInvoice.aggregate([
    { $match: { vendorId: req.vendor._id } },
    {
      $group: {
        _id: '$status',
        total: { $sum: '$totalAmount' },
        paid: { $sum: '$amountPaid' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    invoices,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    },
    stats
  });
});

exports.getInvoice = catchAsync(async (req, res) => {
  const invoice = await ManualInvoice.findOne({
    _id: req.params.id,
    vendorId: req.vendor._id
  });

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  res.json(invoice);
});

exports.createInvoice = catchAsync(async (req, res) => {
  const vendorId = req.vendor._id;
  const {
    type,
    customer,
    items,
    discount = 0,
    tax = 0,
    currency = 'NGN',
    issueDate,
    dueDate,
    notes,
    terms,
    paymentMethod,
    paymentReference,
    isRecurring,
    recurringPeriod
  } = req.body;

  if (!type || !['invoice', 'receipt'].includes(type)) {
    return res.status(400).json({ message: 'Type must be invoice or receipt' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'At least one item is required' });
  }

  for (const item of items) {
    if (!item.name || !item.qty || item.unitPrice === undefined) {
      return res.status(400).json({ message: 'Each item must have name, qty, and unitPrice' });
    }
  }

  const processedItems = items.map(item => {
    const itemTotal = (Number(item.qty) * Number(item.unitPrice)) - Number(item.discount || 0);
    return {
      name: item.name,
      description: item.description || '',
      qty: Number(item.qty),
      unitPrice: Number(item.unitPrice),
      discount: Number(item.discount || 0),
      total: itemTotal
    };
  });

  const subtotal = processedItems.reduce((sum, item) => sum + item.total, 0);
  const totalAmount = Number(subtotal) - Number(discount || 0) + Number(tax || 0);

  const invoiceNumber = await generateInvoiceNumber(vendorId, type);

  const invoice = await ManualInvoice.create({
    vendorId,
    invoiceNumber,
    type,
    status: type === 'receipt' ? 'paid' : 'draft',
    customer: {
      name: customer?.name || '',
      phone: customer?.phone || '',
      email: customer?.email || '',
      address: customer?.address || ''
    },
    items: processedItems,
    subtotal,
    discount,
    tax,
    totalAmount,
    amountPaid: type === 'receipt' ? totalAmount : 0,
    balanceDue: type === 'receipt' ? 0 : totalAmount,
    currency,
    issueDate: issueDate ? new Date(issueDate) : new Date(),
    dueDate: dueDate ? new Date(dueDate) : null,
    paidDate: type === 'receipt' ? new Date() : null,
    notes: notes || '',
    terms: terms || '',
    paymentMethod: paymentMethod || '',
    paymentReference: paymentReference || '',
    isRecurring: isRecurring || false,
    recurringPeriod: recurringPeriod || ''
  });

  res.status(201).json({ message: `${type} created successfully`, invoice });
});

exports.updateInvoice = catchAsync(async (req, res) => {
  const {
    customer,
    items,
    discount,
    tax,
    issueDate,
    dueDate,
    notes,
    terms,
    status,
    amountPaid,
    paymentMethod,
    paymentReference
  } = req.body;

  const invoice = await ManualInvoice.findOne({
    _id: req.params.id,
    vendorId: req.vendor._id
  });

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  if (customer) {
    invoice.customer = {
      name: customer.name ?? invoice.customer.name,
      phone: customer.phone ?? invoice.customer.phone,
      email: customer.email ?? invoice.customer.email,
      address: customer.address ?? invoice.customer.address
    };
  }

  if (items && Array.isArray(items) && items.length > 0) {
    const processedItems = items.map(item => {
      const itemTotal = (Number(item.qty) * Number(item.unitPrice)) - Number(item.discount || 0);
      return {
        name: item.name,
        description: item.description || '',
        qty: Number(item.qty),
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount || 0),
        total: itemTotal
      };
    });

    invoice.items = processedItems;
    invoice.subtotal = processedItems.reduce((sum, item) => sum + item.total, 0);
    
    if (discount !== undefined) {
      invoice.discount = Number(discount);
    }
    if (tax !== undefined) {
      invoice.tax = Number(tax);
    }
    
    invoice.totalAmount = Number(invoice.subtotal) - Number(invoice.discount || 0) + Number(invoice.tax || 0);
  }

  if (discount !== undefined) invoice.discount = Number(discount);
  if (tax !== undefined) invoice.tax = Number(tax);
  if (issueDate) invoice.issueDate = new Date(issueDate);
  if (dueDate) invoice.dueDate = new Date(dueDate);
  if (notes !== undefined) invoice.notes = notes;
  if (terms !== undefined) invoice.terms = terms;
  if (status) invoice.status = status;

  if (amountPaid !== undefined) {
    invoice.amountPaid = amountPaid;
    invoice.balanceDue = invoice.totalAmount - amountPaid;
    
    if (amountPaid >= invoice.totalAmount && invoice.status !== 'paid') {
      invoice.status = 'paid';
      invoice.paidDate = new Date();
    }
  }

  if (paymentMethod) invoice.paymentMethod = paymentMethod;
  if (paymentReference) invoice.paymentReference = paymentReference;

  await invoice.save();

  res.json({ message: 'Invoice updated successfully', invoice });
});

exports.deleteInvoice = catchAsync(async (req, res) => {
  const invoice = await ManualInvoice.findOne({
    _id: req.params.id,
    vendorId: req.vendor._id
  });

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  // Allow deletion but warn for certain statuses
  if (invoice.status === 'paid' && invoice.amountPaid >= invoice.totalAmount) {
    // Fully paid - allow delete but could log this
    console.log(`Deleting fully paid invoice: ${invoice.invoiceNumber}`);
  }

  await ManualInvoice.findByIdAndDelete(invoice._id);

  res.json({ message: 'Invoice deleted successfully' });
});

exports.markAsSent = catchAsync(async (req, res) => {
  const invoice = await ManualInvoice.findOneAndUpdate(
    { _id: req.params.id, vendorId: req.vendor._id },
    { sentToCustomer: true, sentDate: new Date() },
    { new: true }
  );

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  res.json({ message: 'Marked as sent', invoice });
});

exports.recordPayment = catchAsync(async (req, res) => {
  const { amount, paymentMethod, paymentReference } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Valid payment amount required' });
  }

  const invoice = await ManualInvoice.findOne({
    _id: req.params.id,
    vendorId: req.vendor._id
  });

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  const paymentAmount = Number(amount);
  const newAmountPaid = Number(invoice.amountPaid) + paymentAmount;
  invoice.amountPaid = newAmountPaid;
  invoice.balanceDue = Number(invoice.totalAmount) - newAmountPaid;
  
  if (paymentMethod) invoice.paymentMethod = paymentMethod;
  if (paymentReference) invoice.paymentReference = paymentReference;
  
  if (newAmountPaid >= Number(invoice.totalAmount)) {
    invoice.status = 'paid';
    invoice.paidDate = new Date();
  }

  await invoice.save();

  res.json({ message: 'Payment recorded', invoice });
});

exports.getInvoiceStats = catchAsync(async (req, res) => {
  const vendorId = req.vendor._id;
  const { period = 'month' } = req.query;

  let startDate = new Date();
  switch (period) {
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(startDate.getMonth() - 1);
  }

  const [stats, recentInvoices] = await Promise.all([
    ManualInvoice.aggregate([
      { $match: { vendorId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$type',
          totalCount: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$amountPaid' }
        }
      }
    ]),
    ManualInvoice.find({ vendorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('invoiceNumber type status totalAmount amountPaid createdAt')
  ]);

  const overdueCount = await ManualInvoice.countDocuments({
    vendorId,
    status: { $in: ['issued', 'overdue'] },
    dueDate: { $lt: new Date() }
  });

  res.json({
    stats,
    overdueCount,
    recentInvoices
  });
});