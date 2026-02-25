const express = require('express');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const Income = require('../models/Income');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/fees
// @desc    Get all fees
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { student, class: classId, month, year, status } = req.query;
    let query = {};

    if (student) query.student = student;
    if (classId) query.class = classId;
    if (month) query.month = month;
    if (year) query.year = parseInt(year);
    if (status) query.status = status;

    const fees = await Fee.find(query)
      .populate('student', 'firstName lastName admissionNo')
      .populate('class', 'name section')
      .sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/fees/:id
// @desc    Get single fee
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate('student', 'firstName lastName admissionNo fatherName motherName')
      .populate('class', 'name section');
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/fees
// @desc    Create fee record
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const receiptCount = await Fee.countDocuments();
    const receiptNumber = `RCP${(receiptCount + 1).toString().padStart(5, '0')}`;
    
    const feeData = {
      ...req.body,
      receiptNumber
    };
    
    const fee = await Fee.create(feeData);
    res.status(201).json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/fees/:id
// @desc    Update fee record
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/fees/:id
// @desc    Delete fee record
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    await fee.deleteOne();
    res.json({ message: 'Fee record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/fees/student/:studentId
// @desc    Get student fee history
// @access  Private
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId })
      .sort({ year: -1, month: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/fees/pending
// @desc    Get pending fees
// @access  Private
router.get('/pending/all', protect, async (req, res) => {
  try {
    const fees = await Fee.find({ status: { $ne: 'Paid' } })
      .populate('student', 'firstName lastName admissionNo')
      .populate('class', 'name section')
      .sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/fees/pay/:id
// @desc    Pay fee
// @access  Private
router.post('/pay/:id', protect, async (req, res) => {
  try {
    const { paidAmount, paymentMode, transactionId, paymentDate } = req.body;
    
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    // Get student info
    const student = await Student.findById(fee.student);

    const totalPayable = fee.amount + fee.fine - fee.discount;
    const newPaidAmount = fee.paidAmount + paidAmount;

    fee.paidAmount = newPaidAmount;
    if (paymentMode) fee.paymentMode = paymentMode;
    if (transactionId) fee.transactionId = transactionId;
    if (paymentDate) fee.paymentDate = paymentDate;
    else fee.paymentDate = new Date();

    if (newPaidAmount >= totalPayable) {
      fee.status = 'Paid';
    } else if (newPaidAmount > 0) {
      fee.status = 'Partial';
    }

    await fee.save();

    // Auto-add income when fee is paid
    if (paidAmount > 0) {
      const incomeData = {
        title: `Fee Payment - ${student?.firstName} ${student?.lastName} (${fee.month} ${fee.year})`,
        amount: paidAmount,
        category: 'Tuition Fee',
        description: `Receipt No: ${fee.receiptNumber}`,
        date: paymentDate || new Date(),
        paymentMode: paymentMode || 'Cash',
        transactionId: transactionId || ''
      };
      await Income.create(incomeData);
    }

    res.json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
