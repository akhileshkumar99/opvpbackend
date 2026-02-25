const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  feeType: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  fine: {
    type: Number,
    default: 0
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Card', 'Bank Transfer', 'UPI', 'Cheque'],
  },
  transactionId: {
    type: String
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid'],
    default: 'Pending'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Fee', feeSchema);
