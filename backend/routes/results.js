const express = require('express');
const Result = require('../models/Result');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/results
// @desc    Get all results
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { student, exam, class: classId, session, status } = req.query;
    let query = {};

    if (student) query.student = student;
    if (exam) query.exam = exam;
    if (classId) query.class = classId;
    if (session) query.session = session;
    if (status) query.status = status;

    const results = await Result.find(query)
      .populate('student', 'firstName lastName admissionNo rollNumber')
      .populate('exam', 'name')
      .populate('class', 'name section')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/results/:id
// @desc    Get single result
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('student', 'firstName lastName admissionNo fatherName motherName')
      .populate('exam', 'name startDate endDate')
      .populate('class', 'name section');
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/results
// @desc    Create result
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { student, exam, class: classId, marks, session } = req.body;

    // Calculate total and obtained marks
    let totalMarks = 0;
    let obtainedMarks = 0;
    const processedMarks = marks.map(m => {
      totalMarks += m.maxMarks;
      obtainedMarks += m.marks;
      
      // Calculate grade
      const percentage = (m.marks / m.maxMarks) * 100;
      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B+';
      else if (percentage >= 60) grade = 'B';
      else if (percentage >= 50) grade = 'C';
      else if (percentage >= 40) grade = 'D';
      
      return { ...m, grade };
    });

    const percentage = (obtainedMarks / totalMarks) * 100;
    let finalGrade = 'F';
    if (percentage >= 90) finalGrade = 'A+';
    else if (percentage >= 80) finalGrade = 'A';
    else if (percentage >= 70) finalGrade = 'B+';
    else if (percentage >= 60) finalGrade = 'B';
    else if (percentage >= 50) finalGrade = 'C';
    else if (percentage >= 40) finalGrade = 'D';

    const resultData = {
      student,
      exam,
      class: classId,
      marks: processedMarks,
      totalMarks,
      obtainedMarks,
      percentage,
      grade: finalGrade,
      status: percentage >= 40 ? 'Pass' : 'Fail',
      session
    };

    const result = await Result.create(resultData);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/results/:id
// @desc    Update result
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { marks } = req.body;

    // Recalculate marks
    let totalMarks = 0;
    let obtainedMarks = 0;
    const processedMarks = marks.map(m => {
      totalMarks += m.maxMarks;
      obtainedMarks += m.marks;
      
      const percentage = (m.marks / m.maxMarks) * 100;
      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B+';
      else if (percentage >= 60) grade = 'B';
      else if (percentage >= 50) grade = 'C';
      else if (percentage >= 40) grade = 'D';
      
      return { ...m, grade };
    });

    const percentage = (obtainedMarks / totalMarks) * 100;
    let finalGrade = 'F';
    if (percentage >= 90) finalGrade = 'A+';
    else if (percentage >= 80) finalGrade = 'A';
    else if (percentage >= 70) finalGrade = 'B+';
    else if (percentage >= 60) finalGrade = 'B';
    else if (percentage >= 50) finalGrade = 'C';
    else if (percentage >= 40) finalGrade = 'D';

    const result = await Result.findByIdAndUpdate(
      req.params.id,
      {
        marks: processedMarks,
        totalMarks,
        obtainedMarks,
        percentage,
        grade: finalGrade,
        status: percentage >= 40 ? 'Pass' : 'Fail'
      },
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/results/:id
// @desc    Delete result
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    await result.deleteOne();
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/results/student/:studentId
// @desc    Get student results
// @access  Private
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.studentId })
      .populate('exam', 'name')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
