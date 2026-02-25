import { useState, useEffect } from 'react';
import { noticeAPI } from '../../services/api';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await noticeAPI.getPublic();
        setNotices(response.data);
      } catch (error) { console.error('Error:', error); }
      finally { setLoading(false); }
    };
    fetchNotices();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Notice Board</h1>
        <p className="text-gray-600">Stay updated with latest announcements</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
      ) : notices.length > 0 ? (
        <div className="max-w-3xl mx-auto space-y-4">
          {notices.map(notice => (
            <div key={notice._id} className={`card border-l-4 ${notice.priority === 'Urgent' ? 'border-red-500' : notice.priority === 'Important' ? 'border-yellow-500' : 'border-primary-500'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${notice.noticeType === 'Holiday' ? 'bg-purple-100 text-purple-700' : notice.noticeType === 'Event' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                  {notice.noticeType || notice.type}
                </span>
                {notice.priority !== 'Normal' && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${notice.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {notice.priority}
                  </span>
                )}
                <span className="text-sm text-gray-400">{new Date(notice.publishDate || notice.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{notice.title}</h2>
              <p className="text-gray-600">{notice.description}</p>
              {notice.image && <img src={notice.image} alt={notice.title} className="mt-3 w-full max-h-96 object-cover rounded" />}
              {notice.expiryDate && (
                <p className="text-sm text-gray-400 mt-2">Valid until: {new Date(notice.expiryDate).toLocaleDateString()}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No notices available</div>
      )}
    </div>
  );
};

export default Notices;
