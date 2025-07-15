import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PieChart, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAnalytics(selectedPeriod as 'week' | 'month' | 'quarter' | 'year');
      setReportData(response);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReportData({
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        categoryBreakdown: {}
      });
    } finally {
      setLoading(false);
    }
  };
  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

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
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Financial Reports</h1>
              <p className="text-sm text-slate-400">Analyze your spending patterns and trends</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Period Selection */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-orange-400">Report Period</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedPeriod === period.value
                    ? 'bg-orange-600 border-orange-500 text-white'
                    : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="text-sm font-medium text-slate-300">Total Income</span>
            </div>
            <p className="text-3xl font-bold text-green-400">
              ${(reportData.totalIncome || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingDown className="w-6 h-6 text-red-400" />
              <span className="text-sm font-medium text-slate-300">Total Expenses</span>
            </div>
            <p className="text-3xl font-bold text-red-400">
              ${(reportData.totalExpenses || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">Net Balance</span>
            </div>
            <p className={`text-3xl font-bold ${(reportData.netBalance || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${(reportData.netBalance || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-orange-400">Category Breakdown</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-slate-400 mt-2">Loading category breakdown...</p>
            </div>
          ) : !reportData.categoryBreakdown || Object.keys(reportData.categoryBreakdown).length === 0 ? (
            <div className="text-center py-8">
              <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-400">No category data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(reportData.categoryBreakdown).map(([category, amount]) => {
                const percentage = reportData.totalExpenses > 0 ? ((amount as number) / reportData.totalExpenses) * 100 : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">{category}</span>
                      <span className="text-white font-semibold">${(amount as number).toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      {percentage.toFixed(1)}% of total expenses
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-orange-400">Spending Trend</h2>
          <div className="text-center py-8">
            <PieChart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Chart visualization will be implemented with your backend data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;