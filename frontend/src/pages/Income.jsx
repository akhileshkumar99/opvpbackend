import { useState, useEffect } from 'react';
import { incomeAPI } from '../services/api';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', amount: '', category: '', description: '', date: '', paymentMode: 'Cash'
  });
  const [totalIncome, setTotalIncome] = useState(0);
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => { fetchIncomes(); }, [filterCategory]);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const response = await incomeAPI.getAll({ category: filterCategory });
      setIncomes(response.data.incomes || response.data);
      const total = (response.data.incomes || response.data).reduce((sum, i) => sum + i.amount, 0);
      setTotalIncome(total);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await incomeAPI.create(formData);
      setShowForm(false);
      setFormData({ title: '', amount: '', category: '', description: '', date: '', paymentMode: 'Cash' });
      fetchIncomes();
    } catch (error) {
      console.error('Error saving income:', error);
      alert('Failed to save income');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this income record?')) {
      try {
        await incomeAPI.delete(id);
        fetchIncomes();
      } catch (error) {
        console.error('Error deleting income:', error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Income Management</h1>
          <p className="text-gray-500">Track all income sources</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '✕ Cancel' : '+ Add Income'}
        </button>
      </div>

      {/* Summary Card */}
      <div className="card bg-green-50 border border-green-200">
        <h2 className="text-lg font-bold text-green-800">Total Income</h2>
        <p className="text-3xl font-bold text-green-600 mt-2">₹{totalIncome.toLocaleString()}</p>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Add New Income</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="label">Title *</label><input type="text" name="title" className="input" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
              <div><label className="label">Amount (₹) *</label><input type="number" name="amount" className="input" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required /></div>
              <div><label className="label">Category *</label>
                <select name="category" className="input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                  <option value="">Select</option>
                  <option value="Tuition Fee">Tuition Fee</option>
                  <option value="Admission Fee">Admission Fee</option>
                  <option value="Transport Fee">Transport Fee</option>
                  <option value="Book Sale">Book Sale</option>
                  <option value="Donation">Donation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div><label className="label">Date</label><input type="date" name="date" className="input" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} /></div>
              <div><label className="label">Payment Mode</label>
                <select name="paymentMode" className="input" value={formData.paymentMode} onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
              <div><label className="label">Description</label><input type="text" name="description" className="input" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
            </div>
            <div className="mt-4"><button type="submit" className="btn btn-primary">Save Income</button></div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="card">
        <select className="input max-w-xs" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Tuition Fee">Tuition Fee</option>
          <option value="Admission Fee">Admission Fee</option>
          <option value="Transport Fee">Transport Fee</option>
          <option value="Book Sale">Book Sale</option>
          <option value="Donation">Donation</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
        ) : incomes.length > 0 ? (
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Amount</th><th>Payment Mode</th><th>Actions</th></tr></thead>
              <tbody>
                {incomes.map(income => (
                  <tr key={income._id}>
                    <td>{new Date(income.date).toLocaleDateString()}</td>
                    <td className="font-medium">{income.title}</td>
                    <td>{income.category}</td>
                    <td className="text-green-600 font-medium">₹{income.amount.toLocaleString()}</td>
                    <td>{income.paymentMode}</td>
                    <td><button onClick={() => handleDelete(income._id)} className="text-red-500 hover:text-red-700">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No income records found</div>
        )}
      </div>
    </div>
  );
};

export default Income;
