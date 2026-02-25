import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { teacherAPI } from '../services/api';

const TeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    qualification: '',
    experience: '',
    subject: '',
    phone: '',
    email: '',
    address: '',
    salary: '',
    joiningDate: '',
    status: 'Active'
  });

  useEffect(() => {
    if (isEdit) {
      fetchTeacher();
    } else {
      generateEmployeeId();
    }
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const response = await teacherAPI.getById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching teacher:', error);
    }
  };

  const generateEmployeeId = async () => {
    try {
      const response = await teacherAPI.generateEmployeeId();
      setFormData(prev => ({ ...prev, employeeId: response.data.employeeId }));
    } catch (error) {
      console.error('Error generating employee id:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...formData, salary: Number(formData.salary) };
      if (isEdit) {
        await teacherAPI.update(id, data);
      } else {
        await teacherAPI.create(data);
      }
      navigate('/admin/teachers');
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Failed to save teacher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Teacher' : 'Add New Teacher'}
          </h1>
          <p className="text-gray-500">
            {isEdit ? 'Update teacher information' : 'Fill in teacher details'}
          </p>
        </div>
        <button onClick={() => navigate('/admin/teachers')} className="btn btn-secondary">
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Employee ID *</label>
              <input
                type="text"
                name="employeeId"
                className="input"
                value={formData.employeeId}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">First Name *</label>
              <input
                type="text"
                name="firstName"
                className="input"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input
                type="text"
                name="lastName"
                className="input"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Gender *</label>
              <select name="gender" className="input" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                className="input"
                value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                className="input"
                value={formData.joiningDate ? formData.joiningDate.split('T')[0] : ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Qualification</label>
              <input
                type="text"
                name="qualification"
                className="input"
                value={formData.qualification}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Experience</label>
              <input
                type="text"
                name="experience"
                className="input"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 5 years"
              />
            </div>
            <div>
              <label className="label">Subject</label>
              <select name="subject" className="input" value={formData.subject} onChange={handleChange}>
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
                <option value="Hindi">Hindi</option>
                <option value="Social Science">Social Science</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
            <div>
              <label className="label">Monthly Salary (₹)</label>
              <input
                type="number"
                name="salary"
                className="input"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select name="status" className="input" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Retired">Retired</option>
                <option value="Resigned">Resigned</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Phone</label>
              <input
                type="text"
                name="phone"
                className="input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="label">Address</label>
              <textarea
                name="address"
                className="input"
                rows="2"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : isEdit ? 'Update Teacher' : 'Add Teacher'}
          </button>
          <button type="button" onClick={() => navigate('/admin/teachers')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherForm;
