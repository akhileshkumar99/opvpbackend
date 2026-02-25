import { useState, useEffect } from 'react';
import { examAPI, classAPI } from '../services/api';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', class: '', subject: '', date: '', startTime: '', endTime: '', totalMarks: '', status: 'Scheduled' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examsRes, classesRes] = await Promise.all([examAPI.getAll(), classAPI.getAll()]);
      setExams(examsRes.data.exams || examsRes.data);
      setClasses(classesRes.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await examAPI.create(formData);
      setShowForm(false);
      setFormData({ name: '', class: '', subject: '', date: '', startTime: '', endTime: '', totalMarks: '', status: 'Scheduled' });
      fetchData();
    } catch (error) { alert('Failed to save exam'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this exam?')) {
      try { await examAPI.delete(id); fetchData(); }
      catch (error) { console.error('Error:', error); }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">Exam Management</h1><p className="text-gray-500">Manage exams and schedules</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">{showForm ? '✕ Cancel' : '+ Add Exam'}</button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Add New Exam</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="label">Exam Name *</label><input type="text" name="name" className="input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
              <div><label className="label">Class *</label><select name="class" className="input" value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} required><option value="">Select</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
              <div><label className="label">Subject *</label><input type="text" name="subject" className="input" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required /></div>
              <div><label className="label">Date *</label><input type="date" name="date" className="input" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required /></div>
              <div><label className="label">Start Time</label><input type="time" name="startTime" className="input" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} /></div>
              <div><label className="label">End Time</label><input type="time" name="endTime" className="input" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} /></div>
              <div><label className="label">Total Marks</label><input type="number" name="totalMarks" className="input" value={formData.totalMarks} onChange={(e) => setFormData({...formData, totalMarks: e.target.value})} /></div>
            </div>
            <div className="mt-4"><button type="submit" className="btn btn-primary">Save Exam</button></div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div> : exams.length > 0 ? (
          <div className="table-container">
            <table>
              <thead><tr><th>Exam Name</th><th>Class</th><th>Subject</th><th>Date</th><th>Time</th><th>Marks</th><th>Actions</th></tr></thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam._id}>
                    <td className="font-medium">{exam.name}</td>
                    <td>{exam.class?.name || '-'}</td>
                    <td>{exam.subject}</td>
                    <td>{exam.date ? new Date(exam.date).toLocaleDateString() : '-'}</td>
                    <td>{exam.startTime || '-'} - {exam.endTime || '-'}</td>
                    <td>{exam.totalMarks || '-'}</td>
                    <td><button onClick={() => handleDelete(exam._id)} className="text-red-500">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="text-center py-12 text-gray-500">No exams found</div>}
      </div>
    </div>
  );
};

export default Exams;
