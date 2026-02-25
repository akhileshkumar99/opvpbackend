const http = require('http');

const postData = JSON.stringify({
  firstName: "John",
  lastName: "Doe",
  gender: "Male",
  dateOfBirth: "2010-05-15",
  fatherName: "Michael Doe",
  motherName: "Mary Doe",
  phone: "9876543210",
  email: "john.doe@email.com",
  address: "123 Main Street, City",
  class: "Class 5",
  previousSchool: "ABC Public School",
  message: "Looking forward to join"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/admission',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing admission API...');

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(postData);
req.end();
