import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, BarChart3, Target, Calendar } from 'lucide-react';

const Analytics: React.FC = () => {
  const navigate = useNavigate();

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
            <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Financial Analytics</h1>
              <p className="text-sm text-slate-400">Advanced insights and predictions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Coming Soon */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
          <BarChart3 className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">Advanced Analytics</h2>
          <p className="text-slate-400 mb-6">
            Detailed financial analytics and insights will be available once connected to your backend.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <Target className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Spending Goals</h3>
              <p className="text-sm text-slate-400">Track your financial targets</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Trend Analysis</h3>
              <p className="text-sm text-slate-400">Understand spending patterns</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Predictions</h3>
              <p className="text-sm text-slate-400">Future spending forecasts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;