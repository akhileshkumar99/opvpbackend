const http = require('http');

const postData = JSON.stringify({
  firstName: "Test",
  lastName: "Student",
  gender: "Male",
  dateOfBirth: "2010-01-01",
  fatherName: "Mr Test",
  phone: "9876543210",
  address: "Test Address",
  class: "Class 1"
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
