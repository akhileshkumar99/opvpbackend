import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if user was logged in (token exists)
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/password', data),
  init: () => api.post('/auth/init')
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getChart: (year) => api.get('/dashboard/chart', { params: { year } })
};

// Student APIs
export const studentAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  generateAdmissionNo: () => api.get('/students/admission-no/generate')
};

// Teacher APIs
export const teacherAPI = {
  getAll: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
  generateEmployeeId: () => api.get('/teachers/employee-id/generate'),
  getSalaries: (id) => api.get(`/teachers/${id}/salaries`),
  addSalary: (id, data) => api.post(`/teachers/${id}/salaries`, data)
};

// Fee APIs
export const feeAPI = {
  getAll: (params) => api.get('/fees', { params }),
  getById: (id) => api.get(`/fees/${id}`),
  create: (data) => api.post('/fees', data),
  update: (id, data) => api.put(`/fees/${id}`, data),
  delete: (id) => api.delete(`/fees/${id}`),
  getByStudent: (studentId) => api.get(`/fees/student/${studentId}`),
  getPending: () => api.get('/fees/pending/all'),
  pay: (id, data) => api.post(`/fees/pay/${id}`, data)
};

// Income APIs
export const incomeAPI = {
  getAll: (params) => api.get('/income', { params }),
  getById: (id) => api.get(`/income/${id}`),
  create: (data) => api.post('/income', data),
  update: (id, data) => api.put(`/income/${id}`, data),
  delete: (id) => api.delete(`/income/${id}`),
  getTotal: (params) => api.get('/income/total/sum', { params })
};

// Expense APIs
export const expenseAPI = {
  getAll: (params) => api.get('/expense', { params }),
  getById: (id) => api.get(`/expense/${id}`),
  create: (data) => api.post('/expense', data),
  update: (id, data) => api.put(`/expense/${id}`, data),
  delete: (id) => api.delete(`/expense/${id}`),
  getTotal: (params) => api.get('/expense/total/sum', { params })
};

// Attendance APIs
export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  mark: (data) => api.post('/attendance', data),
  markBulk: (data) => api.post('/attendance/bulk', data),
  getByStudent: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params }),
  getByClass: (classId, params) => api.get(`/attendance/class/${classId}`, { params })
};

// Exam APIs
export const examAPI = {
  getAll: (params) => api.get('/exams', { params }),
  getById: (id) => api.get(`/exams/${id}`),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
  updateStatus: (id, status) => api.put(`/exams/${id}/status`, { status })
};

// Result APIs
export const resultAPI = {
  getAll: (params) => api.get('/results', { params }),
  getById: (id) => api.get(`/results/${id}`),
  create: (data) => api.post('/results', data),
  update: (id, data) => api.put(`/results/${id}`, data),
  delete: (id) => api.delete(`/results/${id}`),
  getByStudent: (studentId) => api.get(`/results/student/${studentId}`)
};

// Notice APIs
export const noticeAPI = {
  getAll: (params) => api.get('/notices', { params }),
  getPublic: () => api.get('/notices/public'),
  getById: (id) => api.get(`/notices/${id}`),
  create: (data) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.post('/notices', data, config);
  },
  update: (id, data) => api.put(`/notices/${id}`, data),
  delete: (id) => api.delete(`/notices/${id}`)
};

// Class APIs
export const classAPI = {
  getAll: (params) => api.get('/classes', { params }),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  getSections: (name) => api.get(`/classes/sections/${name}`)
};

// Gallery APIs
export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }),
  getById: (id) => api.get(`/gallery/${id}`),
  create: (data) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.post('/gallery', data, config);
  },
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`)
};

// Admission APIs
export const admissionAPI = {
  getAll: (params) => api.get('/admission', { params }),
  getById: (id) => api.get(`/admission/${id}`),
  submit: (data) => api.post('/admission', data),
  update: (id, data) => api.put(`/admission/${id}`, data),
  delete: (id) => api.delete(`/admission/${id}`)
};

// Contact APIs
export const contactAPI = {
  getAll: (params) => api.get('/contact', { params }),
  create: (data) => api.post('/contact', data),
  delete: (id) => api.delete(`/contact/${id}`)
};

export default api;
