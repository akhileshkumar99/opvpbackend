const express = require('express');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Fee = require('../models/Fee');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Attendance = require('../models/Attendance');
const Notice = require('../models/Notice');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    
    // Total students
    const totalStudents = await Student.countDocuments({ status: 'Active' });
    
    // Total staff
    const totalStaff = await Teacher.countDocuments({ status: 'Active' });
    
    // Fees collected - ALL TIME (from Fee collection with Paid status)
    const allFeesCollected = await Fee.aggregate([
      {
        $match: {
          status: 'Paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$paidAmount' }
        }
      }
    ]);
    
    // Fees collected this month
    const monthlyFeesCollected = await Fee.aggregate([
      {
        $match: {
          status: 'Paid',
          year: currentYear,
          month: currentMonth
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$paidAmount' }
        }
      }
    ]);
    
    // Pending fees
    const pendingFees = await Fee.aggregate([
      {
        $match: {
          status: { $ne: 'Paid' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $subtract: ['$amount', '$paidAmount'] } }
        }
      }
    ]);
    
    // Today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAttendance = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const presentCount = todayAttendance.find(a => a._id === 'Present')?.count || 0;
    const absentCount = todayAttendance.find(a => a._id === 'Absent')?.count || 0;
    
    // Total income (all time)
    const totalIncome = await Income.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    // Total expenses (all time)
    const totalExpense = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    // Recent notices
    const recentNotices = await Notice.find({ isActive: true })
      .sort({ publishDate: -1 })
      .limit(5);
    
    res.json({
      totalStudents,
      totalStaff,
      feesCollected: allFeesCollected[0]?.total || 0,
      monthlyFeesCollected: monthlyFeesCollected[0]?.total || 0,
      pendingFees: pendingFees[0]?.total || 0,
      todayAttendance: {
        present: presentCount,
        absent: absentCount,
        total: presentCount + absentCount
      },
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      recentNotices
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/dashboard/chart
// @desc    Get income/expense chart data
// @access  Private
router.get('/chart', protect, async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = parseInt(year) || new Date().getFullYear();
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Get all income and expense data for the year
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear + 1, 0, 1);
    
    // Get income data - convert string dates to Date objects if needed
    const allIncomes = await Income.find({
      $or: [
        { date: { $gte: startDate, $lt: endDate } },
        { date: { $gte: startDate.toISOString(), $lt: endDate.toISOString() } }
      ]
    });
    
    // Get expense data - convert string dates to Date objects if needed
    const allExpenses = await Expense.find({
      $or: [
        { date: { $gte: startDate, $lt: endDate } },
        { date: { $gte: startDate.toISOString(), $lt: endDate.toISOString() } }
      ]
    });
    
    // Group by month manually to handle both Date and string formats
    const incomeByMonth = Array(12).fill(0);
    const expenseByMonth = Array(12).fill(0);
    
    allIncomes.forEach(income => {
      let date = income.date;
      // If date is a string, convert it
      if (typeof date === 'string') {
        date = new Date(date);
      }
      if (date && date.getFullYear() === targetYear) {
        const monthIndex = date.getMonth();
        incomeByMonth[monthIndex] += income.amount || 0;
      }
    });
    
    allExpenses.forEach(expense => {
      let date = expense.date;
      // If date is a string, convert it
      if (typeof date === 'string') {
        date = new Date(date);
      }
      if (date && date.getFullYear() === targetYear) {
        const monthIndex = date.getMonth();
        expenseByMonth[monthIndex] += expense.amount || 0;
      }
    });
    
    const chartData = months.map((month, index) => ({
      month,
      income: incomeByMonth[index],
      expense: expenseByMonth[index]
    }));
    
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
