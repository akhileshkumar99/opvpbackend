const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  admissionNo: {
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
  religion: {
    type: String
  },
  category: {
    type: String,
    enum: ['General', 'OBC', 'SC', 'ST', 'Other'],
    default: 'General'
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
  fatherName: {
    type: String
  },
  motherName: {
    type: String
  },
  guardianPhone: {
    type: String
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  section: {
    type: String
  },
  rollNumber: {
    type: Number
  },
  session: {
    type: String,
    required: true
  },
  profileImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Passed Out', 'Transferred'],
    default: 'Active'
  },
  totalFee: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);
