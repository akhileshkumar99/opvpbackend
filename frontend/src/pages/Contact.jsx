import { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await contactAPI.getAll();
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await contactAPI.delete(id);
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
        <p className="text-gray-500">View all contact form submissions</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : messages.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg._id}>
                    <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td className="font-medium">{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.phone || '-'}</td>
                    <td>{msg.subject}</td>
                    <td className="max-w-xs truncate">{msg.message}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(msg._id)} 
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No messages found
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
