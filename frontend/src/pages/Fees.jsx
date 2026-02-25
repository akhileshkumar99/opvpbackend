import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { feeAPI, studentAPI } from '../services/api';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [payAmount, setPayAmount] = useState('');

  useEffect(() => {
    fetchFees();
  }, [search, filterStatus, filterMonth, currentPage]);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const response = await feeAPI.getAll({
        search,
        status: filterStatus,
        month: filterMonth,
        page: currentPage,
        limit: 10
      });
      setFees(response.data.fees || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayClick = (fee) => {
    setSelectedFee(fee);
    setPayAmount(fee.amount - fee.paidAmount);
    setShowPayModal(true);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      await feeAPI.pay(selectedFee._id, {
        paidAmount: Number(payAmount),
        paymentDate: new Date(),
        paymentMode: 'Cash'
      });
      setShowPayModal(false);
      fetchFees();
    } catch (error) {
      console.error('Error paying fee:', error);
      alert('Failed to process payment');
    }
  };

  const handleDownloadReceipt = (fee) => {
    setSelectedFee(fee);
    setShowReceiptModal(true);
  };

  const printReceipt = () => {
    const printContent = document.getElementById('receipt-content').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=400');
    printWindow.document.write('<html><head><title>Fee Receipt - OPVP KOLHAMPUR PUBLIC SCHOOL</title>');
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      try {
        await feeAPI.delete(id);
        fetchFees();
      } catch (error) {
        console.error('Error deleting fee:', error);
        alert('Failed to delete fee');
      }
    }
  };

  const schoolName = "OPVP KOLHAMPUR PUBLIC SCHOOL";
  const schoolAddress = "Main Road, Kolhapur";

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fees Management</h1>
          <p className="text-gray-500">Manage student fee records and payments</p>
        </div>
        <Link to="/admin/fees/add" className="btn btn-primary">+ Collect Fee</Link>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Search Student</label>
            <input type="text" className="input" placeholder="Search by admission no..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div>
            <label className="label">Month</label>
            <select className="input" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              <option value="">All Months</option>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (<option key={m} value={m}>{m}</option>))}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={fetchFees} className="btn btn-secondary w-full">Filter</button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : fees.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Student</th>
                  <th>Fee Type</th>
                  <th>Month</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => {
                  const due = fee.amount - fee.paidAmount;
                  const displayDue = due > 0 ? due : 0;
                  const displayStatus = due <= 0 ? 'Paid' : fee.status;
                  return (
                  <tr key={fee._id}>
                    <td className="font-mono text-sm">{fee.receiptNumber || '-'}</td>
                    <td className="font-medium">{fee.student?.firstName} {fee.student?.lastName}<span className="text-gray-400 text-xs ml-1">({fee.student?.admissionNo})</span></td>
                    <td>{fee.feeType}</td>
                    <td>{fee.month}</td>
                    <td>₹{fee.amount}</td>
                    <td className="text-green-600">₹{fee.paidAmount}</td>
                    <td className={displayDue > 0 ? 'text-red-600' : 'text-green-600'}>₹{displayDue}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${displayStatus === 'Paid' ? 'bg-green-100 text-green-700' : displayStatus === 'Partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{displayStatus}</span>
                    </td>
                    <td>
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => handleDownloadReceipt(fee)} className="text-blue-600 hover:text-blue-700">Receipt</button>
                        {fee.status !== 'Paid' && <button onClick={() => handlePayClick(fee)} className="text-green-600 hover:text-green-700">Pay</button>}
                        <Link to={`/admin/fees/${fee._id}`} className="text-primary-600 hover:text-primary-700">View</Link>
                        <button onClick={() => handleDelete(fee._id)} className="text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No fee records found</div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn btn-secondary">Previous</button>
            <span className="flex items-center px-4 text-sm">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn btn-secondary">Next</button>
          </div>
        )}
      </div>

      {showPayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Pay Fee</h2>
            <form onSubmit={handlePay}>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Student: {selectedFee?.student?.firstName} {selectedFee?.student?.lastName}</p>
                <p className="text-sm text-gray-500">Total Amount: ₹{selectedFee?.amount}</p>
                <p className="text-sm text-gray-500">Pending: ₹{selectedFee?.amount - selectedFee?.paidAmount}</p>
              </div>
              <div className="mb-4">
                <label className="label">Pay Amount</label>
                <input type="number" className="input" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary flex-1">Pay</button>
                <button type="button" onClick={() => setShowPayModal(false)} className="btn btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReceiptModal && selectedFee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div id="receipt-content" className="p-4">
              <div className="text-center border-b-2 border-gray-800 pb-2 mb-2">
                <h2 className="text-lg font-bold">{schoolName}</h2>
                <p className="text-xs text-gray-600">{schoolAddress}</p>
                <p className="text-sm font-semibold mt-1">Fee Receipt</p>
              </div>
              <div className="space-y-1 text-xs mb-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Receipt No:</span>
                  <span className="font-mono font-medium">{selectedFee.receiptNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{new Date(selectedFee.paymentDate || Date.now()).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Student Name:</span>
                  <span className="font-medium">{selectedFee.student?.firstName} {selectedFee.student?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Admission No:</span>
                  <span className="font-medium">{selectedFee.student?.admissionNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Class:</span>
                  <span className="font-medium">{selectedFee.class?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee Type:</span>
                  <span className="font-medium">{selectedFee.feeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Month:</span>
                  <span className="font-medium">{selectedFee.month} {selectedFee.year}</span>
                </div>
              </div>
              <div className="border-t border-b border-gray-300 py-2 mb-2">
                <div className="flex justify-between text-xs">
                  <span>Total Amount:</span>
                  <span className="font-bold">₹{selectedFee.amount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Paid Amount:</span>
                  <span>₹{selectedFee.paidAmount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Discount:</span>
                  <span>₹{selectedFee.discount || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Fine:</span>
                  <span>₹{selectedFee.fine || 0}</span>
                </div>
                <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-gray-800">
                  <span>Due:</span>
                  <span>₹{selectedFee.amount - selectedFee.paidAmount - (selectedFee.discount || 0) + (selectedFee.fine || 0)}</span>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500"> Payment Mode:</span>
                  <span className="font-medium">{selectedFee.paymentMode || 'Cash'}</span>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-300">
                <p>Computer-generated receipt</p>
              </div>
            </div>
            <div className="flex gap-2 p-3 pt-0">
              <button onClick={printReceipt} className="btn btn-primary flex-1 text-sm py-2">Print</button>
              <button onClick={() => setShowReceiptModal(false)} className="btn btn-secondary flex-1 text-sm py-2">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;
