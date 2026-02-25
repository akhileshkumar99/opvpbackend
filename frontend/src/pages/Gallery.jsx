import { useState, useEffect } from 'react';
import { galleryAPI } from '../services/api';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '' });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchGallery(); }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await galleryAPI.getAll();
      setItems(response.data.gallery || response.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      alert('Please select at least one image');
      return;
    }
    setUploading(true);
    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const formDataToSend = new FormData();
        formDataToSend.append('image', imageFiles[i]);
        formDataToSend.append('title', `${formData.title} ${imageFiles.length > 1 ? `(${i + 1})` : ''}`);
        formDataToSend.append('category', formData.category);
        
        await galleryAPI.create(formDataToSend);
      }
      alert(`${imageFiles.length} image(s) uploaded successfully!`);
      setShowForm(false);
      setFormData({ title: '', category: '' });
      setImageFiles([]);
      fetchGallery();
    } catch (error) { 
      console.error('Upload error:', error);
      alert('Failed to save: ' + (error.response?.data?.message || error.message)); 
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this image?')) {
      try { await galleryAPI.delete(id); fetchGallery(); }
      catch (error) { console.error('Error:', error); }
    }
  };

  const categories = ['Academic', 'Sports', 'Events', 'Cultural', 'Infrastructure', 'Other'];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1><p className="text-gray-500">Manage school gallery</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">{showForm ? '✕ Cancel' : '+ Add Images'}</button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Add New Images</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label">Title *</label><input type="text" name="title" className="input" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
              <div><label className="label">Category</label><select name="category" className="input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}><option value="">Select</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="md:col-span-2">
                <label className="label">Upload Images * (Multiple selection allowed)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="input" 
                  multiple
                  onChange={(e) => setImageFiles(Array.from(e.target.files))} 
                  required 
                />
                {imageFiles.length > 0 && <p className="text-sm text-gray-600 mt-1">{imageFiles.length} file(s) selected</p>}
              </div>
            </div>
            <div className="mt-4"><button type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Uploading...' : `Save ${imageFiles.length || ''} Image(s)`}</button></div>
          </form>
        </div>
      )}

      {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div> : items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item._id} className="card p-2">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                <img src={item.imageUrl || 'https://via.placeholder.com/300'} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-sm" dangerouslySetInnerHTML={{ __html: item.title }}></h3>
              <p className="text-xs text-gray-500">{item.category}</p>
              <button onClick={() => handleDelete(item._id)} className="text-red-500 text-sm mt-2">Delete</button>
            </div>
          ))}
        </div>
      ) : <div className="text-center py-12 text-gray-500">No gallery items found</div>}
    </div>
  );
};

export default Gallery;
