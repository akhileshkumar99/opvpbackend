const http = require('http');

// First, login to get token
const loginData = JSON.stringify({
  username: "admin",
  password: "admin123"
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

console.log('=== Testing Login ===');
const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Login Status:', res.statusCode);
    const response = JSON.parse(data);
    console.log('Login Success! Token received.');
    
    // Now test dashboard with token
    console.log('\n=== Testing Dashboard API ===');
    const dashboardOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/dashboard/stats',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${response.token}`
      }
    };
    
    const dashboardReq = http.request(dashboardOptions, (res2) => {
      let data2 = '';
      res2.on('data', (chunk) => { data2 += chunk; });
      res2.on('end', () => {
        console.log('Dashboard Status:', res2.statusCode);
        console.log('Dashboard Response:', data2);
      });
    });
    
    dashboardReq.on('error', (error) => {
      console.error('Dashboard Error:', error);
    });
    
    dashboardReq.end();
  });
});

loginReq.on('error', (error) => {
  console.error('Login Error:', error);
});

loginReq.write(loginData);
loginReq.end();
