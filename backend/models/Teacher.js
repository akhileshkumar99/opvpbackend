const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  qualification: {
    type: String
  },
  experience: {
    type: String
  },
  subject: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  salary: {
    type: Number,
    default: 0
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  profileImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Retired', 'Resigned'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);
