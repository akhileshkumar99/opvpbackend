const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
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
    type: String,
    required: true
  },
  email: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  motherName: {
    type: String
  },
  fatherOccupation: {
    type: String
  },
  guardianPhone: {
    type: String
  },
  previousSchool: {
    type: String
  },
  class: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  remarks: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Admission', admissionSchema);
