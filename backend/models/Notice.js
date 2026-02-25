const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  noticeType: {
    type: String,
    enum: ['General', 'Academic', 'Event', 'Holiday', 'Exam', 'Fee', 'Important'],
    default: 'General'
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  forClass: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notice', noticeSchema);
