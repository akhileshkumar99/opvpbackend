import { useState, useEffect } from 'react';
import axios from 'axios';

const HeroSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchSliders(); }, []);

  const fetchSliders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/slider', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSliders(res.data);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image');
      return;
    }
    
    // Check file size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB. Please compress the image.');
      return;
    }
    
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('image', imageFile);
      
      await axios.post('http://localhost:5000/api/slider', formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000
      });
      
      setShowForm(false);
      setImageFile(null);
      fetchSliders();
      alert('Image uploaded successfully!');
    } catch (error) { 
      alert(error.response?.data?.message || 'Upload failed. Check image size or internet connection.'); 
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this slider?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/slider/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSliders();
      } catch (error) { console.error(error); }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hero Slider Management</h1>
          <p className="text-gray-500">Manage homepage hero slider images</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '✕ Cancel' : '+ Add Slider'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Add New Slider</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="label">Upload Image * (Max 5MB)</label>
              <input type="file" accept="image/*" className="input" onChange={(e) => setImageFile(e.target.files[0])} required />
              {imageFile && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Selected: {imageFile.name}</p>
                  <p className="text-xs text-gray-500">Size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Save Slider'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {sliders.map(slider => (
          <div key={slider._id} className="card flex gap-4">
            <img src={slider.imageUrl} alt="Slider" className="w-48 h-32 object-cover rounded" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Uploaded: {new Date(slider.createdAt).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleDelete(slider._id)} className="text-red-500 hover:text-red-700">Delete</button>
          </div>
        ))}
        {sliders.length === 0 && <div className="text-center py-12 text-gray-500">No sliders found</div>}
      </div>
    </div>
  );
};

export default HeroSlider;
