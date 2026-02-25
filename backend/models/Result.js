const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  marks: [{
    subject: String,
    subjectCode: String,
    marks: Number,
    maxMarks: Number,
    grade: String
  }],
  totalMarks: {
    type: Number,
    default: 0
  },
  obtainedMarks: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  grade: {
    type: String
  },
  rank: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Pass', 'Fail'],
    default: 'Pass'
  },
  remarks: {
    type: String
  },
  session: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Result', resultSchema);
