const express = require('express');
const Admission = require('../models/Admission');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admission
// @desc    Get all admission forms
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, class: className } = req.query;
    let query = {};

    if (status) query.status = status;
    if (className) query.class = className;

    const admissions = await Admission.find(query).sort({ createdAt: -1 });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admission/:id
// @desc    Get single admission form
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'Admission form not found' });
    }
    res.json(admission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admission
// @desc    Submit admission form (Public)
router.post('/', async (req, res) => {
  try {
    const admission = await Admission.create(req.body);
    res.status(201).json({
      message: 'Admission form submitted successfully',
      admissionId: admission._id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/admission/:id
// @desc    Update admission status
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!admission) {
      return res.status(404).json({ message: 'Admission form not found' });
    }
    res.json(admission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/admission/:id
// @desc    Delete admission form
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'Admission form not found' });
    }
    await admission.deleteOne();
    res.json({ message: 'Admission form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
