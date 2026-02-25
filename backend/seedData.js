require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Class = require('./models/SchoolClass');
const Fee = require('./models/Fee');
const Income = require('./models/Income');
const Expense = require('./models/Expense');
const Notice = require('./models/Notice');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/opv_kolhampur_school')
  .then(async () => {
    console.log('MongoDB Connected');

    // Create Classes
    const classes = await Class.insertMany([
      { name: 'Class 1', section: 'A', capacity: 40, session: '2024-2025' },
      { name: 'Class 2', section: 'A', capacity: 40, session: '2024-2025' },
      { name: 'Class 3', section: 'A', capacity: 40, session: '2024-2025' },
      { name: 'Class 4', section: 'A', capacity: 40, session: '2024-2025' },
      { name: 'Class 5', section: 'A', capacity: 40, session: '2024-2025' },
    ]);
    console.log('Classes created');

    // Create Teachers
    const teachers = await Teacher.insertMany([
      { name: 'Rajesh Kumar', email: 'rajesh@opvkolhampur.com', phone: '9876543210', subject: 'Mathematics', qualification: 'M.Sc', salary: 35000, joiningDate: new Date('2020-01-15') },
      { name: 'Priya Sharma', email: 'priya@opvkolhampur.com', phone: '9876543211', subject: 'English', qualification: 'M.A', salary: 32000, joiningDate: new Date('2020-03-20') },
      { name: 'Amit Patel', email: 'amit@opvkolhampur.com', phone: '9876543212', subject: 'Science', qualification: 'M.Sc', salary: 34000, joiningDate: new Date('2020-06-10') },
      { name: 'Sunita Verma', email: 'sunita@opvkolhampur.com', phone: '9876543213', subject: 'Hindi', qualification: 'M.A', salary: 30000, joiningDate: new Date('2021-01-05') },
      { name: 'Vikram Singh', email: 'vikram@opvkolhampur.com', phone: '9876543214', subject: 'Social Studies', qualification: 'M.A', salary: 31000, joiningDate: new Date('2021-04-15') },
    ]);
    console.log('Teachers created');

    // Create Students
    const students = [];
    for (let i = 1; i <= 50; i++) {
      students.push({
        name: `Student ${i}`,
        email: `student${i}@opvkolhampur.com`,
        phone: `98765432${String(i).padStart(2, '0')}`,
        class: classes[i % 5]._id,
        rollNumber: `STU${String(i).padStart(4, '0')}`,
        admissionDate: new Date('2024-04-01'),
        dateOfBirth: new Date('2010-01-01'),
        gender: i % 2 === 0 ? 'Male' : 'Female',
        address: `Address ${i}, Kolhampur`,
        parentName: `Parent ${i}`,
        parentPhone: `98765432${String(i).padStart(2, '0')}`
      });
    }
    await Student.insertMany(students);
    console.log('Students created');

    // Create Fees
    const studentDocs = await Student.find();
    const fees = [];
    for (const student of studentDocs) {
      fees.push({
        student: student._id,
        class: student.class,
        amount: 5000,
        dueDate: new Date('2024-03-31'),
        status: Math.random() > 0.3 ? 'paid' : 'pending',
        paidAmount: Math.random() > 0.3 ? 5000 : 0,
        paymentDate: Math.random() > 0.3 ? new Date('2024-03-15') : null
      });
    }
    await Fee.insertMany(fees);
    console.log('Fees created');

    // Create Income
    await Income.insertMany([
      { source: 'Tuition Fees', amount: 250000, date: new Date('2024-01-15'), category: 'fees', description: 'January fees collection' },
      { source: 'Admission Fees', amount: 50000, date: new Date('2024-02-10'), category: 'admission', description: 'New admissions' },
      { source: 'Exam Fees', amount: 30000, date: new Date('2024-03-05'), category: 'exam', description: 'Annual exam fees' },
    ]);
    console.log('Income created');

    // Create Expenses
    await Expense.insertMany([
      { category: 'Salary', amount: 150000, date: new Date('2024-01-31'), description: 'Staff salaries for January' },
      { category: 'Maintenance', amount: 25000, date: new Date('2024-02-15'), description: 'Building maintenance' },
      { category: 'Utilities', amount: 15000, date: new Date('2024-03-10'), description: 'Electricity and water bills' },
    ]);
    console.log('Expenses created');

    // Create Notices
    await Notice.insertMany([
      { title: 'Annual Day Celebration', content: 'Annual day will be celebrated on 15th March 2024', date: new Date('2024-03-01'), isActive: true },
      { title: 'Parent-Teacher Meeting', content: 'PTM scheduled for 20th March 2024', date: new Date('2024-03-05'), isActive: true },
      { title: 'Sports Day', content: 'Sports day on 25th March 2024', date: new Date('2024-03-10'), isActive: true },
    ]);
    console.log('Notices created');

    console.log('\n✅ Sample data added successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
