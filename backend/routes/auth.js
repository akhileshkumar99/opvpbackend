const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SchoolClass = require('../models/SchoolClass');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'akhilesh123', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user (admin only)
// @access  Private
router.post('/register', protect, async (req, res) => {
  try {
    const { username, password, role, name, email, phone } = req.body;
    
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      password,
      role,
      name,
      email,
      phone
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      name: user.name,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// @route   PUT /api/auth/password
// @desc    Update password
// @access  Private
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/auth/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/init
// @desc    Initialize admin user and default classes
// @access  Public
router.post('/init', async (req, res) => {
  try {
    // Create admin user if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'School Admin',
        email: 'admin@stjosephschool.com',
        phone: '1234567890'
      });
    }

    // Create default classes if not exist
    const defaultClasses = [
      { name: 'Nursery', section: 'A', session: '2024-25' },
      { name: 'LKG', section: 'A', session: '2024-25' },
      { name: 'UKG', section: 'A', session: '2024-25' },
      { name: 'Class 1', section: 'A', session: '2024-25' },
      { name: 'Class 2', section: 'A', session: '2024-25' },
      { name: 'Class 3', section: 'A', session: '2024-25' },
      { name: 'Class 4', section: 'A', session: '2024-25' },
      { name: 'Class 5', section: 'A', session: '2024-25' },
      { name: 'Class 6', section: 'A', session: '2024-25' },
      { name: 'Class 7', section: 'A', session: '2024-25' },
      { name: 'Class 8', section: 'A', session: '2024-25' },
      { name: 'Class 9', section: 'A', session: '2024-25' },
      { name: 'Class 10', section: 'A', session: '2024-25' },
      { name: 'Class 11', section: 'A', session: '2024-25' },
      { name: 'Class 12', section: 'A', session: '2024-25' },
    ];

    for (const cls of defaultClasses) {
      const exists = await SchoolClass.findOne({ name: cls.name, section: cls.section, session: cls.session });
      if (!exists) {
        await SchoolClass.create(cls);
      }
    }

    res.json({ message: 'System initialized with admin user and default classes' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
