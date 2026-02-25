import { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', amount: '', category: '', description: '', date: '', paymentMode: 'Cash', vendor: ''
  });
  const [totalExpense, setTotalExpense] = useState(0);
  const [filterCategory, setFilterCategory] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchExpenses(); }, [filterCategory]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await expenseAPI.getAll({ category: filterCategory });
      setExpenses(response.data.expenses || response.data);
      const total = (response.data.expenses || response.data).reduce((sum, e) => sum + e.amount, 0);
      setTotalExpense(total);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await expenseAPI.update(editingId, formData);
        setEditingId(null);
      } else {
        await expenseAPI.create(formData);
      }
      setShowForm(false);
      setFormData({ title: '', amount: '', category: '', description: '', date: '', paymentMode: 'Cash', vendor: '' });
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      description: expense.description || '',
      date: expense.date ? expense.date.split('T')[0] : '',
      paymentMode: expense.paymentMode || 'Cash',
      vendor: expense.vendor || ''
    });
    setEditingId(expense._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense record?')) {
      try {
        await expenseAPI.delete(id);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const downloadExcel = () => {
    const headers = ['Date', 'Title', 'Category', 'Amount', 'Vendor', 'Description', 'Payment Mode'];
    const csvData = expenses.map(expense => [
      new Date(expense.date).toLocaleDateString(),
      expense.title,
      expense.category,
      expense.amount,
      expense.vendor || '',
      expense.description || '',
      expense.paymentMode || 'Cash'
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const categories = ['Salary', 'Infrastructure', 'Utilities', 'Supplies', 'Maintenance', 'Transport', 'Exam', 'Sports', 'Events', 'Other'];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expense Management</h1>
          <p className="text-gray-500">Track all expenses</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadExcel} className="btn btn-secondary">
            ⬇ Download Excel
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? '✕ Cancel' : '+ Add Expense'}
          </button>
        </div>
      </div>

      <div className="card bg-red-50 border border-red-200">
        <h2 className="text-lg font-bold text-red-800">Total Expenses</h2>
        <p className="text-3xl font-bold text-red-600 mt-2">₹{totalExpense.toLocaleString()}</p>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit Expense' : 'Add New Expense'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="label">Title *</label><input type="text" name="title" className="input" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
              <div><label className="label">Amount (₹) *</label><input type="number" name="amount" className="input" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required /></div>
              <div><label className="label">Category *</label>
                <select name="category" className="input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                  <option value="">Select</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
              <div><label className="label">Vendor</label><input type="text" name="vendor" className="input" value={formData.vendor} onChange={(e) => setFormData({...formData, vendor: e.target.value})} /></div>
              <div className="md:col-span-3"><label className="label">Description</label><textarea name="description" className="input" rows="2" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
            </div>
            <div className="mt-4"><button type="submit" className="btn btn-primary">{editingId ? 'Update Expense' : 'Save Expense'}</button></div>
          </form>
        </div>
      )}

      <div className="card">
        <select className="input max-w-xs" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
        ) : expenses.length > 0 ? (
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Amount</th><th>Vendor</th><th>Actions</th></tr></thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense._id}>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="font-medium">{expense.title}</td>
                    <td>{expense.category}</td>
                    <td className="text-red-600 font-medium">₹{expense.amount.toLocaleString()}</td>
                    <td>{expense.vendor || '-'}</td>
                    <td>
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(expense)} className="text-primary-600 hover:text-primary-700">Edit</button>
                        <button onClick={() => handleDelete(expense._id)} className="text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No expense records found</div>
        )}
      </div>
    </div>
  );
};

export default Expense;
