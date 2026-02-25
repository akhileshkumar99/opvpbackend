const express = require('express');
const Exam = require('../models/Exam');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/exams
// @desc    Get all exams
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { class: classId, status, session } = req.query;
    let query = {};

    if (classId) query.class = classId;
    if (status) query.status = status;
    if (session) query.session = session;

    const exams = await Exam.find(query)
      .populate('class', 'name section')
      .sort({ startDate: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/exams/:id
// @desc    Get single exam
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('class', 'name section');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/exams
// @desc    Create new exam
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/exams/:id
// @desc    Update exam
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/exams/:id
// @desc    Delete exam
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    await exam.deleteOne();
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/exams/:id/status
// @desc    Update exam status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
