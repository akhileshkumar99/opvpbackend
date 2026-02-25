import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Settings = () => {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div><h1 className="text-2xl font-bold text-gray-800">Settings</h1><p className="text-gray-500">Manage your account settings</p></div>

      <div className="card">
        <h2 className="text-lg font-bold mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{user?.name || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Username</p><p className="font-medium">{user?.username || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{user?.email || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Role</p><p className="font-medium capitalize">{user?.role || '-'}</p></div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold mb-4">Change Password</h2>
        {message.text && (
          <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handlePasswordChange}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="label">Current Password</label><input type="password" className="input" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} required /></div>
            <div><label className="label">New Password</label><input type="password" className="input" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required /></div>
            <div><label className="label">Confirm Password</label><input type="password" className="input" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} required /></div>
          </div>
          <div className="mt-4"><button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Changing...' : 'Change Password'}</button></div>
        </form>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold mb-4">School Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><p className="text-sm text-gray-500">School Name</p><p className="font-medium">OPVPKOLHAMPUR PUBLIC SCHOOL</p></div>
          <div><p className="text-sm text-gray-500">Established</p><p className="font-medium">1985</p></div>
          <div><p className="text-sm text-gray-500">Address</p><p className="font-medium">Main Road, Kolhampur</p></div>
          <div><p className="text-sm text-gray-500">Session</p><p className="font-medium">2024-25</p></div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
