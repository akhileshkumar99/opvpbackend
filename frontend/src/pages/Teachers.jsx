import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherAPI } from '../services/api';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showSalaryHistoryModal, setShowSalaryHistoryModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [salaryAmount, setSalaryAmount] = useState('');
  const [salaryMonth, setSalaryMonth] = useState('');
  const [salaryYear, setSalaryYear] = useState(new Date().getFullYear());
  const [paymentMode, setPaymentMode] = useState('Cash');

  const schoolName = "ST JOSEPH SCHOOL";
  const schoolAddress = "Main Road, Kolhapur";

  useEffect(() => {
    fetchTeachers();
  }, [search, filterSubject, currentPage]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await teacherAPI.getAll({
        search,
        subject: filterSubject,
        page: currentPage,
        limit: 10
      });
      setTeachers(response.data.teachers || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaySalary = (teacher) => {
    setSelectedTeacher(teacher);
    setSalaryAmount(teacher.salary || '0');
    setSalaryMonth(getCurrentMonth());
    setSalaryYear(new Date().getFullYear());
    setShowSalaryModal(true);
  };

  const handleViewSalaryHistory = async (teacher) => {
    setSelectedTeacher(teacher);
    try {
      const response = await teacherAPI.getSalaries(teacher._id);
      setSalaryHistory(response.data || []);
      setShowSalaryHistoryModal(true);
    } catch (error) {
      console.error('Error fetching salary history:', error);
      alert('Failed to load salary history');
    }
  };

  const handleViewReceipt = (salary) => {
    setSelectedSalary(salary);
    setShowReceiptModal(true);
  };

  const printSalaryReceipt = () => {
    const printContent = document.getElementById('salary-receipt-content').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=400');
    printWindow.document.write('<html><head><title>Salary Receipt - ST JOSEPH SCHOOL</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body{font-family:Arial,sans-serif;padding:15px;font-size:11px;}');
    printWindow.document.write('.text-center{text-align:center;}.border-b-2{border-bottom:2px solid #000;}.pb-2{padding-bottom:8px;}.mb-2{margin-bottom:8px;}');
    printWindow.document.write('.flex{display:flex;}.justify-between{justify-content:space-between;}.mt-2{margin-top:6px;}');
    printWindow.document.write('.border-t{border-top:1px solid #ccc;}.pt-2{padding-top:6px;}.text-sm{font-size:10px;}');
    printWindow.document.write('.font-bold{font-weight:bold;}.text-lg{font-size:14px;}');
    printWindow.document.write('@media print{body{-webkit-print-color-adjust:exact;}}');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  };

  const getCurrentMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'];
    return months[new Date().getMonth()];
  };

  const getLastPaidMonth = (teacherId) => {
    const teacherSalaries = salaryHistory.filter(s => s.teacher === teacherId);
    if (teacherSalaries.length > 0) {
      const last = teacherSalaries[0];
      return `${last.month} ${last.year}`;
    }
    return null;
  };

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    try {
      await teacherAPI.addSalary(selectedTeacher._id, {
        amount: Number(salaryAmount),
        month: salaryMonth,
        year: salaryYear,
        paymentMode,
        paymentDate: new Date()
      });
      setShowSalaryModal(false);
      alert('Salary paid successfully!');
      fetchTeachers();
      if (selectedTeacher) {
        const response = await teacherAPI.getSalaries(selectedTeacher._id);
        setSalaryHistory(response.data || []);
      }
    } catch (error) {
      console.error('Error paying salary:', error);
      alert('Failed to pay salary: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await teacherAPI.delete(id);
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Failed to delete teacher');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teacher & Staff Management</h1>
          <p className="text-gray-500">Manage all teacher and staff records</p>
        </div>
        <Link to="/admin/teachers/add" className="btn btn-primary">+ Add Teacher</Link>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Search</label>
            <input type="text" className="input" placeholder="Search by name or employee id..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div>
            <label className="label">Subject</label>
            <select className="input" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
              <option value="Hindi">Hindi</option>
              <option value="Social Science">Social Science</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={fetchTeachers} className="btn btn-secondary w-full">Filter</button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : teachers.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Phone</th>
                  <th>Salary</th>
                  <th>Last Paid</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td className="font-mono text-sm">{teacher.employeeId}</td>
                    <td className="font-medium">{teacher.firstName} {teacher.lastName}</td>
                    <td>{teacher.subject || '-'}</td>
                    <td>{teacher.phone || '-'}</td>
                    <td>₹{teacher.salary?.toLocaleString() || '0'}</td>
                    <td>{getLastPaidMonth(teacher._id) || '-'}</td>
                    <td>
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => handleViewSalaryHistory(teacher)} className="text-purple-600 hover:text-purple-700">Salary History</button>
                        <button onClick={() => handlePaySalary(teacher)} className="text-green-600 hover:text-green-700">Pay Salary</button>
                        <Link to={`/admin/teachers/${teacher._id}`} className="text-primary-600 hover:text-primary-700">Edit</Link>
                        <button onClick={() => handleDelete(teacher._id)} className="text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No teachers found</div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn btn-secondary disabled:opacity-50">Previous</button>
            <span className="flex items-center px-4 text-sm">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn btn-secondary disabled:opacity-50">Next</button>
          </div>
        )}
      </div>

      {showSalaryModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Pay Salary</h2>
            <form onSubmit={handleSalarySubmit}>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Employee: {selectedTeacher.firstName} {selectedTeacher.lastName}</p>
                <p className="text-sm text-gray-500">Employee ID: {selectedTeacher.employeeId}</p>
                <p className="text-sm text-gray-500">Monthly Salary: ₹{selectedTeacher.salary?.toLocaleString() || '0'}</p>
              </div>
              <div className="mb-4">
                <label className="label">Amount</label>
                <input type="number" className="input" value={salaryAmount} onChange={(e) => setSalaryAmount(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="label">Month</label>
                <select className="input" value={salaryMonth} onChange={(e) => setSalaryMonth(e.target.value)}>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (<option key={m} value={m}>{m}</option>))}
                </select>
              </div>
              <div className="mb-4">
                <label className="label">Year</label>
                <select className="input" value={salaryYear} onChange={(e) => setSalaryYear(e.target.value)}>
                  {[2024, 2025, 2026, 2027, 2028].map(y => (<option key={y} value={y}>{y}</option>))}
                </select>
              </div>
              <div className="mb-4">
                <label className="label">Payment Mode</label>
                <select className="input" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary flex-1">Pay Salary</button>
                <button type="button" onClick={() => setShowSalaryModal(false)} className="btn btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSalaryHistoryModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">Salary History</h2>
                <p className="text-sm text-gray-500">{selectedTeacher.firstName} {selectedTeacher.lastName} - {selectedTeacher.employeeId}</p>
              </div>
              <button onClick={() => setShowSalaryHistoryModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            {salaryHistory.length > 0 ? (
              <div className="space-y-3">
                {salaryHistory.map((salary) => (
                  <div key={salary._id} className="card bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{salary.month} {salary.year}</p>
                        <p className="text-sm text-gray-500">Amount: ₹{salary.netSalary?.toLocaleString() || salary.basicSalary?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Mode: {salary.paymentMode}</p>
                        <p className="text-sm text-gray-500">Date: {salary.paymentDate ? new Date(salary.paymentDate).toLocaleDateString() : '-'}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Paid</span>
                        <button onClick={() => handleViewReceipt(salary)} className="text-blue-600 hover:text-blue-700 text-sm">Receipt</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No salary records found</div>
            )}
          </div>
        </div>
      )}

      {showReceiptModal && selectedSalary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div id="salary-receipt-content" className="p-4">
              <div className="text-center border-b-2 border-gray-800 pb-2 mb-2">
                <h2 className="text-lg font-bold">{schoolName}</h2>
                <p className="text-xs text-gray-600">{schoolAddress}</p>
                <p className="text-sm font-semibold mt-1">Salary Receipt</p>
              </div>
              <div className="space-y-1 text-xs mb-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Employee Name:</span>
                  <span className="font-medium">{selectedTeacher?.firstName} {selectedTeacher?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Employee ID:</span>
                  <span className="font-medium">{selectedTeacher?.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Month:</span>
                  <span className="font-medium">{selectedSalary.month} {selectedSalary.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Date:</span>
                  <span className="font-medium">{selectedSalary.paymentDate ? new Date(selectedSalary.paymentDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</span>
                </div>
              </div>
              <div className="border-t border-b border-gray-300 py-2 mb-2">
                <div className="flex justify-between text-xs">
                  <span>Basic Salary:</span>
                  <span className="font-bold">₹{selectedSalary.basicSalary?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Allowances:</span>
                  <span>₹{selectedSalary.allowances?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Deductions:</span>
                  <span className="text-red-600">-₹{selectedSalary.deductions?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-gray-800">
                  <span>Net Salary:</span>
                  <span>₹{selectedSalary.netSalary?.toLocaleString() || selectedSalary.basicSalary?.toLocaleString() || '0'}</span>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Mode:</span>
                  <span className="font-medium">{selectedSalary.paymentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-green-600 font-medium">Paid</span>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-300">
                <p>Computer-generated receipt</p>
              </div>
            </div>
            <div className="flex gap-2 p-3 pt-0">
              <button onClick={printSalaryReceipt} className="btn btn-primary flex-1 text-sm py-2">Print</button>
              <button onClick={() => setShowReceiptModal(false)} className="btn btn-secondary flex-1 text-sm py-2">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
