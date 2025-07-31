import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

interface MonthlySummaryData {
  month: string;
  totalSpending: {
    current: number;
    previous: number;
  };
  categoryComparison: {
    [category: string]: {
      current: number;
      previous: number;
    };
  };
  savedOrOverspent: {
    amount: number;
    type: 'saved' | 'overspent';
  };
}

const MonthlySummary: React.FC = () => {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState<MonthlySummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonthlySummary();
  }, []);

  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://127.0.0.1:8000/agent/prev_month_summary', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setSummaryData(null);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSummaryData(data);
    } catch (err) {
      console.error('Error fetching monthly summary:', err);
      setError('Failed to load monthly summary data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${Math.abs(amount).toFixed(2)}`;
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
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
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Monthly Spending Summary</h1>
                <p className="text-sm text-slate-400">Compare your spending patterns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading monthly summary...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Monthly Spending Summary</h1>
                <p className="text-sm text-slate-400">Compare your spending patterns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-2">Error Loading Data</p>
            <p className="text-slate-400 mb-4">{error}</p>
            <button
              onClick={fetchMonthlySummary}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!summaryData) {
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
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Monthly Spending Summary</h1>
                <p className="text-sm text-slate-400">Compare your spending patterns</p>
              </div>
            </div>
          </div>
        </div>

        {/* No Data State */}
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Summary Available Yet</h2>
            <p className="text-slate-400">Please check back later.</p>
          </div>
        </div>
      </div>
    );
  }

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
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Monthly Spending Summary</h1>
              <p className="text-sm text-slate-400">Compare your spending patterns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Month Header */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
          <h2 className="text-2xl font-bold text-blue-400 mb-2">{summaryData.month}</h2>
          <p className="text-slate-400">Monthly Spending Comparison</p>
        </div>

        {/* Total Spending Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-400">Current Month</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(summaryData.totalSpending.current)}
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingDown className="w-6 h-6 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-400">Previous Month</h3>
            </div>
            <p className="text-3xl font-bold text-slate-300">
              {formatCurrency(summaryData.totalSpending.previous)}
            </p>
          </div>
        </div>

        {/* Savings/Overspent */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className={`w-6 h-6 ${summaryData.savedOrOverspent.type === 'saved' ? 'text-green-400' : 'text-red-400'}`} />
            <h3 className="text-lg font-semibold text-white">
              {summaryData.savedOrOverspent.type === 'saved' ? 'Amount Saved' : 'Amount Overspent'}
            </h3>
          </div>
          <p className={`text-3xl font-bold ${summaryData.savedOrOverspent.type === 'saved' ? 'text-green-400' : 'text-red-400'}`}>
            {summaryData.savedOrOverspent.type === 'saved' ? '+' : '-'}{formatCurrency(summaryData.savedOrOverspent.amount)}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Compared to previous month
          </p>
        </div>

        {/* Category-wise Comparison */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-6">Category-wise Spending Comparison</h3>
          <div className="space-y-4">
            {Object.entries(summaryData.categoryComparison).map(([category, amounts]) => {
              const percentageChange = calculatePercentageChange(amounts.current, amounts.previous);
              const isIncrease = amounts.current > amounts.previous;
              
              return (
                <div key={category} className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{category}</h4>
                    <div className={`flex items-center space-x-1 text-sm ${
                      isIncrease ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {isIncrease ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{Math.abs(percentageChange).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Current Month</p>
                      <p className="text-lg font-semibold text-white">
                        {formatCurrency(amounts.current)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Previous Month</p>
                      <p className="text-lg font-semibold text-slate-300">
                        {formatCurrency(amounts.previous)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;