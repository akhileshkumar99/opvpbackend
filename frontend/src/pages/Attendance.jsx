import { useState, useEffect } from 'react';
import { attendanceAPI, studentAPI, classAPI } from '../services/api';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSection && date) {
      fetchStudents();
    }
  }, [selectedClass, selectedSection, date]);

  const fetchClasses = async () => {
    try {
      const response = await classAPI.getAll();
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getAll({ class: selectedClass, section: selectedSection });
      const studentList = response.data.students || response.data;
      setStudents(studentList);
      
      // Fetch existing attendance
      const attRes = await attendanceAPI.getByClass(selectedClass, { date });
      const existing = {};
      attRes.data.forEach(a => { existing[a.student._id] = a.status; });
      setAttendanceData(existing);
      setSaved(Object.keys(existing).length > 0);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      const attendanceRecords = students.map(s => ({
        student: s._id,
        date: new Date(date),
        status: attendanceData[s._id] || 'Absent'
      }));
      await attendanceAPI.markBulk({ records: attendanceRecords, date: new Date(date) });
      setSaved(true);
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance');
    }
  };

  const getStats = () => {
    let present = 0, absent = 0;
    students.forEach(s => {
      if (attendanceData[s._id] === 'Present') present++;
      else absent++;
    });
    return { present, absent, total: students.length };
  };

  const stats = getStats();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Attendance</h1>
          <p className="text-gray-500">Mark daily attendance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Class</label>
            <select className="input" value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedSection(''); }}>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Section</label>
            <select className="input" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
              <option value="">Select Section</option>
              {selectedClass && classes.find(c => c._id === selectedClass)?.sections?.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button onClick={fetchStudents} className="btn btn-secondary w-full">Load Students</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {students.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center bg-green-50">
            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            <p className="text-sm text-gray-600">Present</p>
          </div>
          <div className="card text-center bg-red-50">
            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            <p className="text-sm text-gray-600">Absent</p>
          </div>
          <div className="card text-center bg-blue-50">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
      ) : students.length > 0 ? (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Mark Attendance</h2>
            <button onClick={handleSave} className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`}>
              {saved ? '✓ Saved' : 'Save Attendance'}
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Father Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.rollNumber || '-'}</td>
                    <td className="font-medium">{student.firstName} {student.lastName}</td>
                    <td>{student.fatherName || '-'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAttendanceChange(student._id, 'Present')}
                          className={`px-3 py-1 rounded ${attendanceData[student._id] === 'Present' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-100'}`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student._id, 'Absent')}
                          className={`px-3 py-1 rounded ${attendanceData[student._id] === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-100'}`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedClass && selectedSection ? (
        <div className="card text-center py-12 text-gray-500">No students found in this class</div>
      ) : null}
    </div>
  );
};

export default Attendance;
