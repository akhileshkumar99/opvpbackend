const express = require('express');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/attendance
// @desc    Get all attendance records
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { student, class: classId, date, startDate, endDate, status } = req.query;
    let query = {};

    if (student) query.student = student;
    if (classId) query.class = classId;
    if (status) query.status = status;

    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'firstName lastName admissionNo rollNumber')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/attendance
// @desc    Mark attendance
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { student, class: classId, date, status, remarks } = req.body;

    // Check if attendance already marked
    const existingAttendance = await Attendance.findOne({
      student,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
      }
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.remarks = remarks;
      existingAttendance.markedBy = req.user._id;
      await existingAttendance.save();
      return res.json(existingAttendance);
    }

    const attendance = await Attendance.create({
      student,
      class: classId,
      date: new Date(date),
      status,
      remarks,
      markedBy: req.user._id
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/attendance/bulk
// @desc    Mark bulk attendance
// @access  Private
router.post('/bulk', protect, async (req, res) => {
  try {
    const { class: classId, date, attendanceData } = req.body;
    const attendanceRecords = [];

    for (const record of attendanceData) {
      const existingAttendance = await Attendance.findOne({
        student: record.student,
        date: {
          $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
        }
      });

      if (existingAttendance) {
        existingAttendance.status = record.status;
        existingAttendance.remarks = record.remarks;
        existingAttendance.markedBy = req.user._id;
        await existingAttendance.save();
      } else {
        attendanceRecords.push({
          student: record.student,
          class: classId,
          date: new Date(date),
          status: record.status,
          remarks: record.remarks,
          markedBy: req.user._id
        });
      }
    }

    if (attendanceRecords.length > 0) {
      await Attendance.insertMany(attendanceRecords);
    }

    res.status(201).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/attendance/student/:studentId
// @desc    Get student attendance
// @access  Private
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { student: req.params.studentId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/attendance/class/:classId
// @desc    Get class attendance for a date
// @access  Private
router.get('/class/:classId', protect, async (req, res) => {
  try {
    const { date } = req.query;
    const students = await Student.find({ class: req.params.classId, status: 'Active' });
    
    let query = {
      student: { $in: students.map(s => s._id) }
    };

    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'firstName lastName admissionNo rollNumber');

    // Map students with attendance status
    const result = students.map(student => {
      const record = attendance.find(a => a.student._id.toString() === student._id.toString());
      return {
        student,
        status: record ? record.status : 'Not Marked',
        remarks: record ? record.remarks : ''
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
