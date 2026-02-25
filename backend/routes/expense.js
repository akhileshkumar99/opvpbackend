const express = require('express');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/expense
// @desc    Get all expense records
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { category, startDate, endDate, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/expense/:id
// @desc    Get single expense record
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense record not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/expense
// @desc    Add new expense
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/expense/:id
// @desc    Update expense
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).json({ message: 'Expense record not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/expense/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense record not found' });
    }
    await expense.deleteOne();
    res.json({ message: 'Expense record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/expense/total
// @desc    Get total expense
// @access  Private
router.get('/total/sum', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({ total: total[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
