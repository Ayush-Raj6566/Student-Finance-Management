import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, FileText, Plus, ChevronDown } from 'lucide-react';
import { apiService } from '../utils/api';
const AddTransaction: React.FC = () => {
  const navigate = useNavigate();
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionCategory, setTransactionCategory] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([
  'Food', 'Shopping', 'Transportation', 'Entertainment', 'Health'
]);


  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  // const fetchCategories = async () => {
  //   try {
  //     const response = await apiService.getCategories();
  //     setCategories(response.categories || ['Food', 'Shopping', 'Transportation', 'Entertainment', 'Health']);
  //   } catch (error) {
  //     console.error('Error fetching categories:', error);
  //     // Fallback categories
  //     setCategories(['Food', 'Shopping', 'Transportation', 'Entertainment', 'Health']);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transactionData = {
  transaction_amount: parseFloat(transactionAmount),
  transaction_category: transactionCategory,
  transaction_description: transactionDescription,
  transaction_date: new Date().toISOString().split('T')[0],
  transaction_type: transactionType
};

      await apiService.addTransaction(transactionData);
      
      // Navigate back to dashboard after successful addition
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Add New Transaction</h1>
              <p className="text-sm text-slate-400">Enter transaction details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTransactionType('expense')}
                    className={`p-4 rounded-xl border transition-all ${
                      transactionType === 'expense'
                        ? 'bg-red-600/20 border-red-500 text-red-400'
                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType('income')}
                    className={`p-4 rounded-xl border transition-all ${
                      transactionType === 'income'
                        ? 'bg-green-600/20 border-green-500 text-green-400'
                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Transaction Amount */}
              <div className="relative">
  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 text-lg">₹</span>
  <input
    type="number"
    step="0.01"
    value={transactionAmount}
    onChange={(e) => setTransactionAmount(e.target.value)}
    className="w-full pl-10 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
    placeholder="Enter amount (e.g., 100.00)"
    required
  />
</div>


              {/* Transaction Category */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Transaction Category
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full pl-10 pr-12 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg flex items-center justify-between"
                  >
                    <span className={transactionCategory ? 'text-white' : 'text-slate-400'}>
                      {transactionCategory || 'Select category'}
                    </span>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </button>
                  
                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-700 border border-slate-600 rounded-xl shadow-2xl z-10 overflow-hidden">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setTransactionCategory(category);
                            setShowCategoryDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-600 transition-colors text-white border-b border-slate-600 last:border-b-0"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Transaction Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                  <textarea
                    value={transactionDescription}
                    onChange={(e) => setTransactionDescription(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-lg"
                    placeholder="Enter transaction details (e.g., Lunch at campus cafeteria)"
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !transactionAmount || !transactionCategory || !transactionDescription}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100"
                >
                  {loading ? 'Adding Transaction...' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;