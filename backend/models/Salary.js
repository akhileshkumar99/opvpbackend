const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
  allowances: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Card', 'Bank Transfer', 'UPI', 'Cheque'],
    default: 'Bank Transfer'
  },
  transactionId: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  remarks: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Salary', salarySchema);
