const express = require('express');
const Teacher = require('../models/Teacher');
const Salary = require('../models/Salary');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/teachers
// @desc    Get all teachers
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { search, status, subject } = req.query;
    let query = {};

    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const teachers = await Teacher.find(query).sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/teachers/:id
// @desc    Get single teacher
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/teachers
// @desc    Add new teacher
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/teachers/:id
// @desc    Update teacher
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/teachers/:id
// @desc    Delete teacher
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    await teacher.deleteOne();
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/teachers/employee-id/generate
// @desc    Generate employee ID
// @access  Private
router.get('/employee-id/generate', protect, async (req, res) => {
  try {
    const lastTeacher = await Teacher.findOne().sort({ createdAt: -1 });
    let employeeId = 'EMP001';
    if (lastTeacher && lastTeacher.employeeId) {
      const num = parseInt(lastTeacher.employeeId.replace('EMP', '')) + 1;
      employeeId = `EMP${num.toString().padStart(3, '0')}`;
    }
    res.json({ employeeId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Salary Routes
// @route   GET /api/teachers/:id/salaries
// @desc    Get teacher salary history
// @access  Private
router.get('/:id/salaries', protect, async (req, res) => {
  try {
    const salaries = await Salary.find({ teacher: req.params.id })
      .sort({ year: -1, month: -1 });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/teachers/:id/salaries
// @desc    Add salary payment
// @access  Private
router.post('/:id/salaries', protect, async (req, res) => {
  try {
    const { amount, month, year, paymentMode, paymentDate, allowances, deductions, remarks } = req.body;
    
    // Get teacher info
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const netSalary = amount + (allowances || 0) - (deductions || 0);
    
    const salaryData = {
      teacher: req.params.id,
      month,
      year,
      basicSalary: amount,
      allowances: allowances || 0,
      deductions: deductions || 0,
      netSalary: netSalary,
      paymentMode: paymentMode || 'Cash',
      paymentDate: paymentDate || new Date(),
      status: 'Paid',
      remarks: remarks || ''
    };
    
    const salary = await Salary.create(salaryData);

    // Auto-add expense when salary is paid
    const expenseData = {
      title: `Salary Payment - ${teacher.firstName} ${teacher.lastName} (${month} ${year})`,
      amount: netSalary,
      category: 'Staff Salary',
      description: `Employee ID: ${teacher.employeeId}, Mode: ${paymentMode || 'Cash'}`,
      date: paymentDate || new Date(),
      paymentMode: paymentMode || 'Cash',
      vendor: `${teacher.firstName} ${teacher.lastName}`
    };
    await Expense.create(expenseData);

    res.status(201).json(salary);
  } catch (error) {
    console.error('Salary payment error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
