import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { Transaction } from '../types';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filterType, filterCategory, dateRange]);

 const fetchTransactions = async () => {
  try {
    setLoading(true);

    if (!user?.studentId) {
      console.warn("Student ID not available.");
      return;
    }

    const today = new Date();
    const month = today.getMonth() + 1;
    const curr_date = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const response = await apiService.getTransactions({
      student_id: user.studentId,
      month,
      curr_date
    });

    const transformed = (response || []).map((t: any) => ({
      id: String(t.transation_id),
      description: t.transaction_description,
      category: t.transaction_category,
      amount: t.transaction_amount,
      date: t.transaction_date,
      type: t.transaction_type
    }));

    setTransactions(transformed);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    setTransactions([]);
  } finally {
    setLoading(false);
  }
};


  const applyFilters = () => {
    let filtered = [...transactions];

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(t => new Date(t.date) >= filterDate);
    }

    setFilteredTransactions(filtered);
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categories = [...new Set(transactions.map(t => t.category))];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Student Profile</h1>
              <p className="text-sm text-slate-400">Transaction reports and analytics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-blue-400">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-slate-400">Student Name</span>
                  <p className="text-white font-medium">{user?.name}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Email</span>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Student ID</span>
                  <p className="text-white font-medium">{user?.studentId}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Member Since</span>
                  <p className="text-white font-medium">
                    {user?.memberSince ? new Date(user.memberSince).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <span className="text-sm font-medium text-slate-300">Total Income</span>
                </div>
                <p className="text-2xl font-bold text-green-400">${totalIncome.toLocaleString()}</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                  <span className="text-sm font-medium text-slate-300">Total Expenses</span>
                </div>
                <p className="text-2xl font-bold text-red-400">${totalExpenses.toLocaleString()}</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">Net Balance</span>
                </div>
                <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${(totalIncome - totalExpenses).toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-6 h-6 text-purple-400" />
                  <span className="text-sm font-medium text-slate-300">Total Transactions</span>
                </div>
                <p className="text-2xl font-bold text-purple-400">{filteredTransactions.length}</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Filters */}
        {/* <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-blue-400">Filter Transactions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div> */}

        {/* Transaction List */}
        {/* <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">Transaction History</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-slate-400 mt-2">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-400">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{transaction.description}</p>
                        <p className="text-sm text-slate-400">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Profile;