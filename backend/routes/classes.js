const express = require('express');
const SchoolClass = require('../models/SchoolClass');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/classes
// @desc    Get all classes (public for student form)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { session, search } = req.query;
    let query = {};

    if (session) query.session = session;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { section: { $regex: search, $options: 'i' } }
      ];
    }

    const classes = await SchoolClass.find(query)
      .populate('teacher', 'firstName lastName')
      .sort({ name: 1, section: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/classes/:id
// @desc    Get single class
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const classData = await SchoolClass.findById(req.params.id)
      .populate('teacher', 'firstName lastName');
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/classes
// @desc    Create new class
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const classData = await SchoolClass.create(req.body);
    res.status(201).json(classData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/classes/:id
// @desc    Update class
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const classData = await SchoolClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/classes/:id
// @desc    Delete class
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const classData = await SchoolClass.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    await classData.deleteOne();
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/classes/sections/:name
// @desc    Get sections for a class name
// @access  Private
router.get('/sections/:name', protect, async (req, res) => {
  try {
    const classes = await SchoolClass.find({ name: req.params.name }).select('section');
    const sections = classes.map(c => c.section);
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
