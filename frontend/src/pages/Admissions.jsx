import { useState, useEffect } from 'react';
import { admissionAPI } from '../services/api';

const Admissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => { fetchAdmissions(); }, [filterStatus]);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const response = await admissionAPI.getAll({ status: filterStatus });
      setAdmissions(response.data.admissions || response.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Approve this admission application?')) {
      try {
        await admissionAPI.update(id, { status: 'Approved', remarks: 'Application approved' });
        fetchAdmissions();
      } catch (error) { console.error('Error:', error); }
    }
  };

  const handleReject = async (id) => {
    const remarks = prompt('Enter rejection reason:');
    if (remarks !== null) {
      try {
        await admissionAPI.update(id, { status: 'Rejected', remarks });
        fetchAdmissions();
      } catch (error) { console.error('Error:', error); }
    }
  };

  const handleView = (admission) => {
    setSelectedAdmission(admission);
    setShowModal(true);
  };

  const handleEdit = (admission) => {
    setEditData(admission);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await admissionAPI.update(editData._id, editData);
      setShowEditModal(false);
      fetchAdmissions();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update admission');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this application?')) {
      try { await admissionAPI.delete(id); fetchAdmissions(); }
      catch (error) { console.error('Error:', error); }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">Online Admissions</h1><p className="text-gray-500">Manage submitted admission forms</p></div>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-4 items-center">
          <select className="input max-w-xs" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Reviewed">Reviewed</option>
          </select>
          <button onClick={fetchAdmissions} className="btn btn-secondary">Refresh</button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{admissions.filter(a => a.status === 'Pending').length}</p>
        </div>
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-600">Reviewed</p>
          <p className="text-2xl font-bold text-blue-700">{admissions.filter(a => a.status === 'Reviewed').length}</p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm text-green-600">Approved</p>
          <p className="text-2xl font-bold text-green-700">{admissions.filter(a => a.status === 'Approved').length}</p>
        </div>
        <div className="card bg-red-50 border-red-200">
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-700">{admissions.filter(a => a.status === 'Rejected').length}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div> : admissions.length > 0 ? admissions.map(admission => (
          <div key={admission._id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${admission.status === 'Approved' ? 'bg-green-100 text-green-700' : admission.status === 'Rejected' ? 'bg-red-100 text-red-700' : admission.status === 'Reviewed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {admission.status || 'Pending'}
                  </span>
                  <span className="text-sm text-gray-500">ID: {admission._id.slice(-8)}</span>
                </div>
                <h3 className="text-lg font-bold">{admission.firstName} {admission.lastName}</h3>
                <p className="text-gray-600">Class: {admission.class} | DOB: {admission.dateOfBirth ? new Date(admission.dateOfBirth).toLocaleDateString() : 'N/A'} | Gender: {admission.gender}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                  <p><span className="text-gray-500">Father:</span> {admission.fatherName}</p>
                  <p><span className="text-gray-500">Phone:</span> {admission.phone}</p>
                  <p><span className="text-gray-500">Email:</span> {admission.email}</p>
                  <p><span className="text-gray-500">Applied:</span> {new Date(admission.createdAt).toLocaleDateString()}</p>
                </div>
                {admission.remarks && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <span className="text-gray-500">Remarks:</span> {admission.remarks}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <button onClick={() => handleView(admission)} className="btn btn-primary text-sm py-2">View</button>
                <button onClick={() => handleEdit(admission)} className="btn btn-secondary text-sm py-2">Edit</button>
                {admission.status !== 'Approved' && (
                  <button onClick={() => handleApprove(admission._id)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-medium">Approve</button>
                )}
                {admission.status !== 'Rejected' && (
                  <button onClick={() => handleReject(admission._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-medium">Reject</button>
                )}
                <button onClick={() => handleDelete(admission._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
              </div>
            </div>
          </div>
        )) : <div className="text-center py-12 text-gray-500">No admission applications found</div>}
      </div>

      {/* View Modal */}
      {showModal && selectedAdmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Admission Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedAdmission.status === 'Approved' ? 'bg-green-100 text-green-700' : selectedAdmission.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {selectedAdmission.status || 'Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-500">First Name</p><p className="font-medium">{selectedAdmission.firstName}</p></div>
                  <div><p className="text-sm text-gray-500">Last Name</p><p className="font-medium">{selectedAdmission.lastName}</p></div>
                  <div><p className="text-sm text-gray-500">Gender</p><p className="font-medium">{selectedAdmission.gender}</p></div>
                  <div><p className="text-sm text-gray-500">Date of Birth</p><p className="font-medium">{selectedAdmission.dateOfBirth ? new Date(selectedAdmission.dateOfBirth).toLocaleDateString() : 'N/A'}</p></div>
                  <div><p className="text-sm text-gray-500">Religion</p><p className="font-medium">{selectedAdmission.religion || 'N/A'}</p></div>
                  <div><p className="text-sm text-gray-500">Category</p><p className="font-medium">{selectedAdmission.category}</p></div>
                  <div><p className="text-sm text-gray-500">Class Applied</p><p className="font-medium">{selectedAdmission.class}</p></div>
                  <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{selectedAdmission.phone}</p></div>
                  <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{selectedAdmission.email || 'N/A'}</p></div>
                  <div><p className="text-sm text-gray-500">Father's Name</p><p className="font-medium">{selectedAdmission.fatherName}</p></div>
                  <div><p className="text-sm text-gray-500">Mother's Name</p><p className="font-medium">{selectedAdmission.motherName || 'N/A'}</p></div>
                  <div><p className="text-sm text-gray-500">Father's Occupation</p><p className="font-medium">{selectedAdmission.fatherOccupation || 'N/A'}</p></div>
                  <div><p className="text-sm text-gray-500">Guardian Phone</p><p className="font-medium">{selectedAdmission.guardianPhone || 'N/A'}</p></div>
                  <div><p className="text-sm text-gray-500">Previous School</p><p className="font-medium">{selectedAdmission.previousSchool || 'N/A'}</p></div>
                </div>
                <div><p className="text-sm text-gray-500">Address</p><p className="font-medium">{selectedAdmission.address}</p></div>
                {selectedAdmission.remarks && <div><p className="text-sm text-gray-500">Remarks</p><p className="font-medium">{selectedAdmission.remarks}</p></div>}
                <div><p className="text-sm text-gray-500">Applied On</p><p className="font-medium">{new Date(selectedAdmission.createdAt).toLocaleString()}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleUpdate}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">Edit Admission</h2>
                  <button type="button" onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">First Name</label><input type="text" className="input" value={editData.firstName} onChange={(e) => setEditData({...editData, firstName: e.target.value})} /></div>
                  <div><label className="label">Last Name</label><input type="text" className="input" value={editData.lastName} onChange={(e) => setEditData({...editData, lastName: e.target.value})} /></div>
                  <div><label className="label">Gender</label><select className="input" value={editData.gender} onChange={(e) => setEditData({...editData, gender: e.target.value})}><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                  <div><label className="label">Date of Birth</label><input type="date" className="input" value={editData.dateOfBirth?.split('T')[0]} onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})} /></div>
                  <div><label className="label">Religion</label><input type="text" className="input" value={editData.religion || ''} onChange={(e) => setEditData({...editData, religion: e.target.value})} /></div>
                  <div><label className="label">Category</label><select className="input" value={editData.category} onChange={(e) => setEditData({...editData, category: e.target.value})}><option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option><option value="Other">Other</option></select></div>
                  <div><label className="label">Class</label><input type="text" className="input" value={editData.class} onChange={(e) => setEditData({...editData, class: e.target.value})} /></div>
                  <div><label className="label">Phone</label><input type="text" className="input" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} /></div>
                  <div><label className="label">Email</label><input type="email" className="input" value={editData.email || ''} onChange={(e) => setEditData({...editData, email: e.target.value})} /></div>
                  <div><label className="label">Father's Name</label><input type="text" className="input" value={editData.fatherName} onChange={(e) => setEditData({...editData, fatherName: e.target.value})} /></div>
                  <div><label className="label">Mother's Name</label><input type="text" className="input" value={editData.motherName || ''} onChange={(e) => setEditData({...editData, motherName: e.target.value})} /></div>
                  <div><label className="label">Father's Occupation</label><input type="text" className="input" value={editData.fatherOccupation || ''} onChange={(e) => setEditData({...editData, fatherOccupation: e.target.value})} /></div>
                  <div><label className="label">Guardian Phone</label><input type="text" className="input" value={editData.guardianPhone || ''} onChange={(e) => setEditData({...editData, guardianPhone: e.target.value})} /></div>
                  <div><label className="label">Previous School</label><input type="text" className="input" value={editData.previousSchool || ''} onChange={(e) => setEditData({...editData, previousSchool: e.target.value})} /></div>
                  <div><label className="label">Status</label><select className="input" value={editData.status} onChange={(e) => setEditData({...editData, status: e.target.value})}><option value="Pending">Pending</option><option value="Reviewed">Reviewed</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select></div>
                  <div><label className="label">Remarks</label><input type="text" className="input" value={editData.remarks || ''} onChange={(e) => setEditData({...editData, remarks: e.target.value})} /></div>
                </div>
                <div className="mt-4"><label className="label">Address</label><textarea className="input" rows="2" value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} /></div>
                
                <div className="flex gap-4 mt-6">
                  <button type="submit" className="btn btn-primary">Update</button>
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admissions;
