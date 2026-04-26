const mongoose = require('mongoose');

const manualInvoiceItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  qty: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 }
}, { _id: true });

const manualInvoiceSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  invoiceNumber: { type: String, required: true },
  type: { type: String, enum: ['invoice', 'receipt'], required: true },
  status: { 
    type: String, 
    enum: ['draft', 'issued', 'paid', 'overdue', 'cancelled'], 
    default: 'draft' 
  },
  customer: {
    name: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    address: { type: String, default: '' }
  },
  items: [manualInvoiceItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  amountPaid: { type: Number, default: 0, min: 0 },
  balanceDue: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'NGN' },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  paidDate: { type: Date },
  notes: { type: String, default: '' },
  terms: { type: String, default: '' },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'bank_transfer', 'pos', 'ussd', 'mobile_money', 'other', ''], 
    default: '' 
  },
  paymentReference: { type: String, default: '' },
  relatedOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  pdfUrl: { type: String, default: '' },
  isRecurring: { type: Boolean, default: false },
  recurringPeriod: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', ''], 
    default: '' 
  },
  sentToCustomer: { type: Boolean, default: false },
  sentDate: { type: Date },
  viewedByCustomer: { type: Boolean, default: false },
  viewedDate: { type: Date }
}, { timestamps: true });

manualInvoiceSchema.index({ vendorId: 1, invoiceNumber: 1 });
manualInvoiceSchema.index({ vendorId: 1, status: 1 });
manualInvoiceSchema.index({ vendorId: 1, createdAt: -1 });
manualInvoiceSchema.index({ 'customer.phone': 1, vendorId: 1 });
manualInvoiceSchema.index({ dueDate: 1, status: 1 });

manualInvoiceSchema.methods.calculateBalance = function() {
  this.balanceDue = this.totalAmount - this.amountPaid;
  return this.balanceDue;
};

module.exports = mongoose.model('ManualInvoice', manualInvoiceSchema);