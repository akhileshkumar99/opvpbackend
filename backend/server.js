require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const tempDir = path.join(__dirname, 'uploads/temp');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/opv_kolhampur_school')
  .then(async () => {
    console.log('MongoDB Connected');
    // Create default admin user if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'School Admin',
        email: 'admin@opvkolhampur.com',
        phone: '1234567890'
      });
      console.log('Default admin user created: admin / admin123');
    }
  })
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/income', require('./routes/income'));
app.use('/api/expense', require('./routes/expense'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/results', require('./routes/results'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/admission', require('./routes/admission'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/slider', require('./routes/slider'));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large' });
  }
  res.status(500).json({ message: error.message || 'Internal server error' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
