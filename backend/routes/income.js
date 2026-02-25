const express = require('express');
const Income = require('../models/Income');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/income
// @desc    Get all income records
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

    const incomes = await Income.find(query).sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/income/:id
// @desc    Get single income record
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/income
// @desc    Add new income
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const income = await Income.create(req.body);
    res.status(201).json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/income/:id
// @desc    Update income
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }
    res.json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/income/:id
// @desc    Delete income
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }
    await income.deleteOne();
    res.json({ message: 'Income record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/income/total
// @desc    Get total income
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

    const total = await Income.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({ total: total[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
