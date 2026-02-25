import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentAPI, classAPI } from '../services/api';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    admissionNo: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    religion: '',
    category: 'General',
    phone: '',
    email: '',
    address: '',
    fatherName: '',
    motherName: '',
    guardianPhone: '',
    class: '',
    section: '',
    rollNumber: '',
    session: '2024-25',
    status: 'Active',
    totalFee: 0
  });

  useEffect(() => {
    fetchClasses();
    if (isEdit) {
      fetchStudent();
    } else {
      generateAdmissionNo();
    }
  }, [id]);

  const fetchClasses = async () => {
    try {
      setError('');
      const response = await classAPI.getAll();
      setClasses(response.data || []);
      if (response.data.length === 0) {
        setError('No classes found. Please add classes first in Settings.');
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes. Please try again.');
    }
  };

  const fetchStudent = async () => {
    try {
      const response = await studentAPI.getById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching student:', error);
      setError('Failed to load student data');
    }
  };

  const generateAdmissionNo = async () => {
    try {
      const response = await studentAPI.generateAdmissionNo();
      setFormData(prev => ({ ...prev, admissionNo: response.data.admissionNo }));
    } catch (error) {
      console.error('Error generating admission no:', error);
      // Generate local admission number as fallback
      const localNo = 'STJ' + Date.now().toString().slice(-6);
      setFormData(prev => ({ ...prev, admissionNo: localNo }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate required fields
      if (!formData.admissionNo || !formData.firstName || !formData.lastName || !formData.dateOfBirth) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        rollNumber: formData.rollNumber ? parseInt(formData.rollNumber) : undefined
      };

      if (isEdit) {
        await studentAPI.update(id, submitData);
      } else {
        await studentAPI.create(submitData);
      }
      navigate('/admin/students');
    } catch (err) {
      console.error('Error saving student:', err);
      setError(err.response?.data?.message || 'Failed to save student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Student' : 'Add New Student'}
          </h1>
          <p className="text-gray-500">
            {isEdit ? 'Update student information' : 'Fill in student details'}
          </p>
        </div>
        <button onClick={() => navigate('/admin/students')} className="btn btn-secondary">
          ← Back
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchClasses} className="text-sm underline hover:text-red-900">
            Refresh
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Admission No *</label>
              <input
                type="text"
                name="admissionNo"
                className="input"
                value={formData.admissionNo}
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
              <label className="label">Religion</label>
              <input
                type="text"
                name="religion"
                className="input"
                value={formData.religion}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select name="category" className="input" value={formData.category} onChange={handleChange}>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Session *</label>
              <input
                type="text"
                name="session"
                className="input"
                value={formData.session}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select name="status" className="input" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Passed Out">Passed Out</option>
                <option value="Transferred">Transferred</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Class</label>
              <select 
                name="class" 
                className="input" 
                value={formData.class} 
                onChange={handleChange}
                disabled={classes.length === 0}
              >
                <option value="">
                  {classes.length === 0 ? 'No Classes Available' : 'Select Class'}
                </option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} - Section {cls.section}
                  </option>
                ))}
              </select>
              {classes.length === 0 && (
                <p className="text-xs text-orange-500 mt-1">
                  Go to Classes page to add classes
                </p>
              )}
            </div>
            <div>
              <label className="label">Section</label>
              <input
                type="text"
                name="section"
                className="input"
                value={formData.section}
                onChange={handleChange}
                placeholder="A, B, C..."
              />
            </div>
            <div>
              <label className="label">Roll Number</label>
              <input
                type="number"
                name="rollNumber"
                className="input"
                value={formData.rollNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Total Fee (₹)</label>
              <input
                type="number"
                name="totalFee"
                className="input"
                value={formData.totalFee || 0}
                onChange={handleChange}
                placeholder="Enter total fee for session"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
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

        {/* Parent Information */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Parent Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                className="input"
                value={formData.fatherName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                className="input"
                value={formData.motherName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Guardian Phone</label>
              <input
                type="text"
                name="guardianPhone"
                className="input"
                value={formData.guardianPhone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={loading || classes.length === 0} 
            className={`btn btn-primary ${loading || classes.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Student' : 'Add Student'}
          </button>
          <button type="button" onClick={() => navigate('/admin/students')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
