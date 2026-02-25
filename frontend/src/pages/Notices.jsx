import { useState, useEffect } from 'react';
import { noticeAPI } from '../services/api';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', type: 'General', priority: 'Normal', publishDate: '', expiryDate: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await noticeAPI.getAll();
      setNotices(response.data.notices || response.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, image: file});
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('noticeType', formData.type);
      if (formData.publishDate) data.append('publishDate', formData.publishDate);
      if (formData.expiryDate) data.append('expiryDate', formData.expiryDate);
      if (formData.image) data.append('image', formData.image);
      
      console.log('Submitting:', {
        title: formData.title,
        description: formData.description,
        type: formData.type
      });
      
      await noticeAPI.create(data);
      setShowForm(false);
      setFormData({ title: '', description: '', type: 'General', priority: 'Normal', publishDate: '', expiryDate: '', image: null });
      setImagePreview(null);
      fetchNotices();
    } catch (error) { 
      console.error('Error:', error);
      alert('Failed to save notice: ' + (error.response?.data?.message || error.message)); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this notice?')) {
      try { await noticeAPI.delete(id); fetchNotices(); }
      catch (error) { console.error('Error:', error); }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">Notice Board</h1><p className="text-gray-500">Manage school notices</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">{showForm ? '✕ Cancel' : '+ Add Notice'}</button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Add New Notice</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="label">Title *</label><input type="text" name="title" className="input" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
              <div className="md:col-span-2"><label className="label">Description *</label><textarea name="description" className="input" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required /></div>
              <div className="md:col-span-2">
                <label className="label">Image (Optional)</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="input" />
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-32 object-cover rounded" />}
              </div>
              <div><label className="label">Type</label><select name="type" className="input" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}><option value="General">General</option><option value="Academic">Academic</option><option value="Event">Event</option><option value="Holiday">Holiday</option></select></div>
              <div><label className="label">Priority</label><select name="priority" className="input" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}><option value="Normal">Normal</option><option value="Important">Important</option><option value="Urgent">Urgent</option></select></div>
              <div><label className="label">Publish Date</label><input type="date" name="publishDate" className="input" value={formData.publishDate} onChange={(e) => setFormData({...formData, publishDate: e.target.value})} /></div>
              <div><label className="label">Expiry Date</label><input type="date" name="expiryDate" className="input" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} /></div>
            </div>
            <div className="mt-4"><button type="submit" className="btn btn-primary">Save Notice</button></div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div> : notices.length > 0 ? notices.map(notice => (
          <div key={notice._id} className={`card border-l-4 ${notice.priority === 'Urgent' ? 'border-red-500' : notice.priority === 'Important' ? 'border-yellow-500' : 'border-primary-500'}`}>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${notice.type === 'Holiday' ? 'bg-purple-100 text-purple-700' : notice.type === 'Event' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{notice.noticeType || notice.type}</span>
                  {notice.priority !== 'Normal' && <span className={`px-2 py-1 rounded text-xs font-medium ${notice.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{notice.priority}</span>}
                </div>
                <h3 className="text-lg font-bold mt-2">{notice.title}</h3>
                <p className="text-gray-600 mt-1">{notice.description}</p>
                {notice.image && <img src={notice.image} alt={notice.title} className="mt-3 h-40 object-cover rounded" />}
                <p className="text-sm text-gray-400 mt-2">Published: {notice.publishDate ? new Date(notice.publishDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <button onClick={() => handleDelete(notice._id)} className="text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        )) : <div className="text-center py-12 text-gray-500">No notices found</div>}
      </div>
    </div>
  );
};

export default Notices;
