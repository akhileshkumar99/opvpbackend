import { useState, useEffect } from 'react';
import { galleryAPI } from '../../services/api';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => { fetchGallery(); }, [filter]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await galleryAPI.getAll({ category: filter });
      setItems(response.data.gallery || response.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const categories = ['All', 'Sports', 'Events', 'Cultural', 'Infrastructure'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Gallery</h1>
        <p className="text-gray-600">Capturing memories and moments</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat === 'All' ? '' : cat)}
            className={`px-4 py-2 rounded-full ${filter === (cat === 'All' ? '' : cat) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item._id} className="aspect-square rounded-lg overflow-hidden group cursor-pointer" onClick={() => setSelectedImage(item)}>
              <img src={item.imageUrl || 'https://via.placeholder.com/300'} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No gallery items found</div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-200 transition-colors z-10">
            ×
          </button>
          <img src={selectedImage.imageUrl} alt={selectedImage.title} className="max-w-full max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default Gallery;
