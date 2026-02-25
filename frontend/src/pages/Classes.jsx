import { useState, useEffect } from 'react';
import { classAPI, teacherAPI } from '../services/api';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', section: '', teacher: '', subjects: [], session: '2024-25' });
  const [subjectInput, setSubjectInput] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classesRes, teachersRes] = await Promise.all([classAPI.getAll(), teacherAPI.getAll()]);
      setClasses(classesRes.data.classes || classesRes.data);
      setTeachers(teachersRes.data.teachers || teachersRes.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await classAPI.update(editingId, formData);
        setEditingId(null);
      } else {
        await classAPI.create(formData);
      }
      setShowForm(false);
      setFormData({ name: '', section: '', teacher: '', subjects: [], session: '2024-25' });
      fetchData();
    } catch (error) { alert('Failed to save class'); }
  };

  const handleEdit = (cls) => {
    setFormData({
      name: cls.name,
      section: cls.section,
      teacher: cls.teacher?._id || '',
      subjects: cls.subjects || [],
      session: cls.session || '2024-25'
    });
    setEditingId(cls._id);
    setShowForm(true);
  };

  const addSubject = () => {
    if (subjectInput) {
      setFormData(prev => ({ ...prev, subjects: [...prev.subjects, subjectInput] }));
      setSubjectInput('');
    }
  };

  const removeSubject = (index) => {
    setFormData(prev => ({ ...prev, subjects: prev.subjects.filter((_, i) => i !== index) }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this class?')) {
      try { await classAPI.delete(id); fetchData(); }
      catch (error) { console.error('Error:', error); }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">Class Management</h1><p className="text-gray-500">Manage classes and sections</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">{showForm ? '✕ Cancel' : '+ Add Class'}</button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit Class' : 'Add New Class'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="label">Class Name *</label><input type="text" name="name" className="input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Class 10" required /></div>
              <div><label className="label">Section *</label><input type="text" name="section" className="input" value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} placeholder="e.g., A, B" required /></div>
              <div><label className="label">Class Teacher</label><select name="teacher" className="input" value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})}><option value="">Select</option>{teachers.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}</select></div>
              <div><label className="label">Session</label><input type="text" name="session" className="input" value={formData.session} onChange={(e) => setFormData({...formData, session: e.target.value})} /></div>
            </div>
            <div className="mt-4">
              <label className="label">Subjects</label>
              <div className="flex gap-2 mb-2">
                <input type="text" className="input" value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} placeholder="Add subject" />
                <button type="button" onClick={addSubject} className="btn btn-secondary">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.subjects.map((sub, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded flex items-center gap-2">
                    {sub} <button type="button" onClick={() => removeSubject(i)} className="text-blue-500 hover:text-blue-700">✕</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4"><button type="submit" className="btn btn-primary">{editingId ? 'Update Class' : 'Save Class'}</button></div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-full flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div> : classes.length > 0 ? classes.map(cls => (
          <div key={cls._id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{cls.name} - {cls.section}</h3>
                <p className="text-sm text-gray-500 mt-1">Teacher: {cls.teacher ? `${cls.teacher.firstName} ${cls.teacher.lastName}` : 'Not assigned'}</p>
                <p className="text-sm text-gray-500">Session: {cls.session}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleEdit(cls)} className="text-primary-600 hover:text-primary-700">Edit</button>
                <button onClick={() => handleDelete(cls._id)} className="text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
            {cls.subjects?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {cls.subjects.map((s, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{s}</span>)}
              </div>
            )}
          </div>
        )) : <div className="col-span-full text-center py-12 text-gray-500">No classes found</div>}
      </div>
    </div>
  );
};

export default Classes;
