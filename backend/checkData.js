require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Fee = require('./models/Fee');
const Income = require('./models/Income');
const Expense = require('./models/Expense');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/opv_kolhampur_school')
  .then(async () => {
    console.log('MongoDB Connected\n');

    const students = await Student.countDocuments();
    const teachers = await Teacher.countDocuments();
    const fees = await Fee.countDocuments();
    const income = await Income.countDocuments();
    const expense = await Expense.countDocuments();

    console.log('📊 Database Stats:');
    console.log(`Students: ${students}`);
    console.log(`Teachers: ${teachers}`);
    console.log(`Fees: ${fees}`);
    console.log(`Income: ${income}`);
    console.log(`Expense: ${expense}`);

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
