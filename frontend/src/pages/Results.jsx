import { useState, useEffect } from 'react';
import { resultAPI, studentAPI, examAPI } from '../services/api';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [formData, setFormData] = useState({ student: '', exam: '', marks: '', grade: '', remarks: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resultsRes, studentsRes, examsRes] = await Promise.all([resultAPI.getAll(), studentAPI.getAll({ limit: 100 }), examAPI.getAll()]);
      setResults(resultsRes.data.results || resultsRes.data);
      setStudents(studentsRes.data.students || studentsRes.data);
      setExams(examsRes.data.exams || examsRes.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resultAPI.create(formData);
      setShowForm(false);
      setFormData({ student: '', exam: '', marks: '', grade: '', remarks: '' });
      fetchData();
    } catch (error) { alert('Failed to save result'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this result?')) {
      try { await resultAPI.delete(id); fetchData(); }
      catch (error) { console.error('Error:', error); }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">Results Management</h1><p className="text-gray-500">Manage student exam results</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">{showForm ? '✕ Cancel' : '+ Add Result'}</button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Add New Result</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label">Student *</label><select name="student" className="input" value={formData.student} onChange={(e) => setFormData({...formData, student: e.target.value})} required><option value="">Select</option>{students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.admissionNo})</option>)}</select></div>
              <div><label className="label">Exam *</label><select name="exam" className="input" value={formData.exam} onChange={(e) => setFormData({...formData, exam: e.target.value})} required><option value="">Select</option>{exams.map(e => <option key={e._id} value={e._id}>{e.name} - {e.subject}</option>)}</select></div>
              <div><label className="label">Marks *</label><input type="number" name="marks" className="input" value={formData.marks} onChange={(e) => setFormData({...formData, marks: e.target.value})} required /></div>
              <div><label className="label">Grade</label><input type="text" name="grade" className="input" value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} placeholder="A, B, C..." /></div>
              <div className="md:col-span-2"><label className="label">Remarks</label><textarea name="remarks" className="input" rows="2" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} /></div>
            </div>
            <div className="mt-4"><button type="submit" className="btn btn-primary">Save Result</button></div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div> : results.length > 0 ? (
          <div className="table-container">
            <table>
              <thead><tr><th>Student</th><th>Exam</th><th>Marks</th><th>Grade</th><th>Remarks</th><th>Actions</th></tr></thead>
              <tbody>
                {results.map(result => (
                  <tr key={result._id}>
                    <td className="font-medium">{result.student?.firstName} {result.student?.lastName}</td>
                    <td>{result.exam?.name} - {result.exam?.subject}</td>
                    <td>{result.marks}</td>
                    <td>{result.grade || '-'}</td>
                    <td>{result.remarks || '-'}</td>
                    <td><button onClick={() => handleDelete(result._id)} className="text-red-500">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="text-center py-12 text-gray-500">No results found</div>}
      </div>
    </div>
  );
};

export default Results;
