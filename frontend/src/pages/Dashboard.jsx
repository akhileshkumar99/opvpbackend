import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, expenseAPI } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartType, setChartType] = useState('bar');
  const [expenseCategories, setExpenseCategories] = useState([]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getChart({ year: selectedYear })
        ]);
        setStats(statsRes.data);
        setChartData(chartRes.data);
        
        // Fetch expense categories
        try {
          const expenseRes = await expenseAPI.getAll();
          const expenses = expenseRes.data.expenses || expenseRes.data;
          
          const categoryTotals = {};
          expenses.forEach(exp => {
            if (categoryTotals[exp.category]) {
              categoryTotals[exp.category] += exp.amount;
            } else {
              categoryTotals[exp.category] = exp.amount;
            }
          });
          
          setExpenseCategories(Object.entries(categoryTotals).map(([name, value]) => ({ name, value })));
        } catch (expError) {
          console.error('Error fetching expense categories:', expError);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);

  const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899', '#06B6D4', '#84CC16'];

  // Calculate running balance for each month
  let runningBalance = 0;
  const chartDataWithBalance = chartData.map(item => {
    runningBalance += item.income - item.expense;
    return {
      ...item,
      balance: runningBalance
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: '👨‍🎓',
      color: 'bg-blue-500',
      link: '/admin/students'
    },
    {
      title: 'Total Staff',
      value: stats?.totalStaff || 0,
      icon: '👨‍🏫',
      color: 'bg-green-500',
      link: '/admin/teachers'
    },
    {
      title: 'Total Fees Collected',
      value: `₹${(stats?.feesCollected || 0).toLocaleString()}`,
      icon: '💰',
      color: 'bg-yellow-500',
      link: '/admin/fees'
    },
    {
      title: 'Pending Fees',
      value: `₹${(stats?.pendingFees || 0).toLocaleString()}`,
      icon: '⏳',
      color: 'bg-red-500',
      link: '/admin/fees'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome to OPVP Kolhampur Public School Management System</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Date</p>
            <p className="font-medium dark:text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="card hover:shadow-lg transition-shadow dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{card.value}</p>
              </div>
              <div className={`w-14 h-14 ${card.color} rounded-xl flex items-center justify-center text-2xl`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Today's Attendance */}
      <div className="card dark:bg-gray-800">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Today's Attendance</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.todayAttendance?.present || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats?.todayAttendance?.absent || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.todayAttendance?.total || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <div className="card dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Income vs Expense</h2>
            <div className="flex gap-2">
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="input w-32 dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="bar">Bar Chart</option>
                <option value="area">Area Chart</option>
                <option value="line">Line Chart</option>
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="input w-24 dark:bg-gray-700 dark:text-white"
              >
                {[2023, 2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" tick={{fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12}} />
                  <YAxis tick={{fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12}} tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`} />
                  <Tooltip 
                    contentStyle={{backgroundColor: darkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '8px'}}
                    labelStyle={{color: darkMode ? '#fff' : '#000'}}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" tick={{fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12}} />
                  <YAxis tick={{fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12}} tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`} />
                  <Tooltip 
                    contentStyle={{backgroundColor: darkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '8px'}}
                    labelStyle={{color: darkMode ? '#fff' : '#000'}}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                </AreaChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" tick={{fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12}} />
                  <YAxis tick={{fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12}} tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`} />
                  <Tooltip 
                    contentStyle={{backgroundColor: darkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '8px'}}
                    labelStyle={{color: darkMode ? '#fff' : '#000'}}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2} dot={{fill: '#10B981', r: 4}} />
                  <Line type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={2} dot={{fill: '#EF4444', r: 4}} />
                </LineChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No chart data available
            </div>
          )}
        </div>

        {/* Balance Trend Chart */}
        <div className="card dark:bg-gray-800">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Balance Trend</h2>
          {chartDataWithBalance.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartDataWithBalance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="month" tick={{fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12}} />
                <YAxis tick={{fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12}} tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`} />
                <Tooltip 
                  contentStyle={{backgroundColor: darkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '8px'}}
                  labelStyle={{color: darkMode ? '#fff' : '#000'}}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Area type="monotone" dataKey="balance" name="Balance" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No balance data available
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary & Pie Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card dark:bg-gray-800">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Financial Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Total Income</span>
              <span className="font-bold text-green-600 dark:text-green-400">₹{(stats?.totalIncome || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Total Expense</span>
              <span className="font-bold text-red-600 dark:text-red-400">₹{(stats?.totalExpense || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Net Balance</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                ₹{((stats?.totalIncome || 0) - (stats?.totalExpense || 0)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">This Month Fees</span>
              <span className="font-bold text-yellow-600 dark:text-yellow-400">₹{(stats?.monthlyFeesCollected || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Expense Distribution Pie Chart */}
        <div className="card dark:bg-gray-800">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Expense Distribution</h2>
          {expenseCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  contentStyle={{backgroundColor: darkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '8px'}}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              No expense data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Notices */}
      <div className="card dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Notices</h2>
          <Link to="/admin/notices" className="text-primary-600 hover:text-primary-700 text-sm">
            View All →
          </Link>
        </div>
        {stats?.recentNotices?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentNotices.map((notice) => (
              <div key={notice._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{notice.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notice.description?.slice(0, 100)}...</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(notice.publishDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No notices available</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card dark:bg-gray-800">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/students/add" className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <span className="text-2xl">👨‍🎓</span>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Add Student</p>
          </Link>
          <Link to="/admin/teachers/add" className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-center hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
            <span className="text-2xl">👨‍🏫</span>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Add Teacher</p>
          </Link>
          <Link to="/admin/fees/add" className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-center hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors">
            <span className="text-2xl">💰</span>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Collect Fee</p>
          </Link>
          <Link to="/admin/notices" className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-center hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
            <span className="text-2xl">📢</span>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Add Notice</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
