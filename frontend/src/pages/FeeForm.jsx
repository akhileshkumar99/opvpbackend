import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { feeAPI, studentAPI, classAPI } from '../services/api';

const FeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    student: '',
    feeType: 'Monthly Fee',
    amount: '',
    month: '',
    year: new Date().getFullYear(),
    notes: ''
  });
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, classesRes] = await Promise.all([
        studentAPI.getAll({ limit: 100 }),
        classAPI.getAll()
      ]);
      setStudents(studentsRes.data.students || studentsRes.data);
      setClasses(classesRes.data);
      
      if (isEdit) {
        const feeRes = await feeAPI.getById(id);
        setFormData(feeRes.data);
        if (feeRes.data.student) {
          setSelectedStudent(feeRes.data.student);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
    setFormData(prev => ({ ...prev, student: studentId }));
    
    if (studentId) {
      try {
        const student = students.find(s => s._id === studentId);
        setSelectedStudent(student);
      } catch (error) {
        console.error('Error finding student:', error);
      }
    } else {
      setSelectedStudent(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await feeAPI.update(id, formData);
      } else {
        await feeAPI.create(formData);
      }
      navigate('/admin/fees');
    } catch (error) {
      console.error('Error saving fee:', error);
      alert('Failed to save fee');
    } finally {
      setLoading(false);
    }
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Fee' : 'Collect Fee'}
          </h1>
          <p className="text-gray-500">
            {isEdit ? 'Update fee information' : 'Add new fee record'}
          </p>
        </div>
        <button onClick={() => navigate('/admin/fees')} className="btn btn-secondary">
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="label">Select Student *</label>
          <select name="student" className="input" value={formData.student} onChange={handleStudentChange} required>
            <option value="">Select Student</option>
            {students.map(s => (
              <option key={s._id} value={s._id}>
                {s.firstName} {s.lastName} ({s.admissionNo})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-gray-700">Student Details</h3>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <p>Class: {selectedStudent.class?.name || '-'}</p>
              <p>Section: {selectedStudent.section || '-'}</p>
              <p>Father: {selectedStudent.fatherName || '-'}</p>
              <p>Phone: {selectedStudent.phone || '-'}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Fee Type *</label>
            <select name="feeType" className="input" value={formData.feeType} onChange={handleChange}>
              <option value="Monthly Fee">Monthly Fee</option>
              <option value="Admission Fee">Admission Fee</option>
              <option value="Exam Fee">Exam Fee</option>
              <option value="Transport Fee">Transport Fee</option>
              <option value="Library Fee">Library Fee</option>
              <option value="Annual Fee">Annual Fee</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="label">Amount (₹) *</label>
            <input type="number" name="amount" className="input" value={formData.amount} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Month *</label>
            <select name="month" className="input" value={formData.month} onChange={handleChange} required>
              <option value="">Select Month</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Year *</label>
            <input type="number" name="year" className="input" value={formData.year} onChange={handleChange} required />
          </div>
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea name="notes" className="input" rows="2" value={formData.notes} onChange={handleChange} />
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : isEdit ? 'Update Fee' : 'Collect Fee'}
          </button>
          <button type="button" onClick={() => navigate('/admin/fees')} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default FeeForm;
