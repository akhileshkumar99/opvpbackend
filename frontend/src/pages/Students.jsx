import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI, classAPI } from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [search, filterClass, filterSection, currentPage]);

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
      const response = await studentAPI.getAll({
        search,
        class: filterClass,
        section: filterSection,
        page: currentPage,
        limit: 10
      });
      setStudents(response.data.students || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(id);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student');
      }
    }
  };

  const getSections = () => {
    const selectedClass = classes.find(c => c._id === filterClass);
    if (selectedClass && selectedClass.sections) {
      return selectedClass.sections;
    }
    return [];
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
          <p className="text-gray-500">Manage all student records</p>
        </div>
        <Link to="/admin/students/add" className="btn btn-primary">
          + Add Student
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Search</label>
            <input
              type="text"
              className="input"
              placeholder="Search by name or admission no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Class</label>
            <select
              className="input"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Section</label>
            <select
              className="input"
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
            >
              <option value="">All Sections</option>
              {getSections().map((section, index) => (
                <option key={index} value={section}>{section}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={fetchStudents} className="btn btn-secondary w-full">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : students.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Admission No</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Father Name</th>
                  <th>Total Fee</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="font-mono text-sm">{student.admissionNo}</td>
                    <td className="font-medium">{student.firstName} {student.lastName}</td>
                    <td>{student.class?.name || '-'}</td>
                    <td>{student.section || '-'}</td>
                    <td>{student.fatherName || '-'}</td>
                    <td>{student.totalFee || '-'}</td>
                    <td>{student.phone || '-'}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/students/${student._id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No students found
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-4 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
