import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, DollarSign, AlertCircle, FileText, Eye, Target, Activity } from 'lucide-react';

interface TransactionReport {
  [category: string]: {
    previous_month_spending: number;
    previous_to_previous_month_spending: number;
    absolute_change: number;
    percentage_change: number;
    trend_indicator: string;
    significance_flag: boolean;
    transaction_count_previous_month: number;
    transaction_count_previous_to_previous_month: number;
  };
}

interface MonthlySummaryData {
  executive_summary: string;
  key_observations: string[];
  notable_changes: string;
  new_spending_areas: string;
  spending_to_watch: string;
  transaction_report: TransactionReport;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: MonthlySummaryData;
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

      const response = await fetch('https://studget.onrender.com/agent/prev_month_summary', {
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

      const apiResponse: ApiResponse = await response.json();
      
      if (!apiResponse.success || !apiResponse.data) {
        setSummaryData(null);
        return;
      }

      setSummaryData(apiResponse.data);
    } catch (err) {
      console.error('Error fetching monthly summary:', err);
      setError('Failed to load monthly summary data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const calculateTotals = () => {
    if (!summaryData?.transaction_report) return { current: 0, previous: 0, difference: 0 };

    const currentTotal = Object.values(summaryData.transaction_report).reduce(
      (sum, category) => sum + category.previous_month_spending, 0
    );
    
    const previousTotal = Object.values(summaryData.transaction_report).reduce(
      (sum, category) => sum + category.previous_to_previous_month_spending, 0
    );

    return {
      current: currentTotal,
      previous: previousTotal,
      difference: currentTotal - previousTotal
    };
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
                <p className="text-sm text-slate-400">Analyze your spending patterns and trends</p>
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
                <p className="text-sm text-slate-400">Analyze your spending patterns and trends</p>
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
                <p className="text-sm text-slate-400">Analyze your spending patterns and trends</p>
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

  const totals = calculateTotals();

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
              <h1 className="text-xl font-bold">Monthly Summary</h1>
              <p className="text-sm text-slate-400">Analyze your spending patterns and trends</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Total Spending Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">Previous Month Total</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(totals.current)}
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingDown className="w-6 h-6 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">Month Before Total</span>
            </div>
            <p className="text-3xl font-bold text-slate-300">
              {formatCurrency(totals.previous)}
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className={`w-6 h-6 ${totals.difference >= 0 ? 'text-red-400' : 'text-green-400'}`} />
              <span className="text-sm font-medium text-slate-300">
                {totals.difference >= 0 ? 'Increased By' : 'Saved'}
              </span>
            </div>
            <p className={`text-3xl font-bold ${totals.difference >= 0 ? 'text-red-400' : 'text-green-400'}`}>
              {formatCurrency(totals.difference)}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-6 h-6 text-blue-400" />
            <h2 className="text-lg font-semibold text-blue-400">Executive Summary</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">{summaryData.executive_summary}</p>
        </div>

        {/* Key Observations */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="w-6 h-6 text-green-400" />
            <h2 className="text-lg font-semibold text-green-400">Key Observations</h2>
          </div>
          <ul className="space-y-2">
            {summaryData.key_observations.map((observation, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-slate-300">{observation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Analysis Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-yellow-400">Notable Changes</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{summaryData.notable_changes}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-400">New Spending Areas</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{summaryData.new_spending_areas}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-orange-400" />
              <h3 className="text-lg font-semibold text-orange-400">Spending to Watch</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{summaryData.spending_to_watch}</p>
          </div>
        </div>

        {/* Transaction Report Table */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-blue-400 mb-6">Category-wise Transaction Report</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Category</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-semibold">Previous Month</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-semibold">Month Before</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-semibold">Change</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-semibold">% Change</th>
                  <th className="text-center py-3 px-4 text-slate-300 font-semibold">Trend</th>
                  <th className="text-center py-3 px-4 text-slate-300 font-semibold">Significant</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summaryData.transaction_report).map(([category, data]) => (
                  <tr key={category} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-medium text-white">{category}</span>
                      <div className="text-xs text-slate-400 mt-1">
                        {data.transaction_count_previous_month} transactions
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-white">
                      {formatCurrency(data.previous_month_spending)}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-300">
                      {formatCurrency(data.previous_to_previous_month_spending)}
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${
                      data.absolute_change >= 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {data.absolute_change >= 0 ? '+' : ''}{formatCurrency(data.absolute_change)}
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${
                      data.percentage_change >= 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {data.percentage_change >= 0 ? '+' : ''}{data.percentage_change.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        data.trend_indicator === 'Increased' 
                          ? 'bg-red-500/20 text-red-400' 
                          : data.trend_indicator === 'Decreased'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {data.trend_indicator === 'Increased' && <TrendingUp className="w-3 h-3" />}
                        {data.trend_indicator === 'Decreased' && <TrendingDown className="w-3 h-3" />}
                        <span>{data.trend_indicator}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        data.significance_flag 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {data.significance_flag ? '!' : '—'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;