const express = require('express');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/students
// @desc    Get all students
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { class: classId, section, search, status, session } = req.query;
    let query = {};

    if (classId) query.class = classId;
    if (section) query.section = section;
    if (status) query.status = status;
    if (session) query.session = session;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .populate('class', 'name section')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/students/:id
// @desc    Get single student
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('class', 'name section');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/students
// @desc    Add new student
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await student.deleteOne();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/students/admission-no/generate
// @desc    Generate admission number
// @access  Private
router.get('/admission-no/generate', protect, async (req, res) => {
  try {
    const lastStudent = await Student.findOne().sort({ createdAt: -1 });
    let admissionNo = 'STJ001';
    if (lastStudent && lastStudent.admissionNo) {
      const num = parseInt(lastStudent.admissionNo.replace('STJ', '')) + 1;
      admissionNo = `STJ${num.toString().padStart(3, '0')}`;
    }
    res.json({ admissionNo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
