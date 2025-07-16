import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Plus, Target, DollarSign } from 'lucide-react';
import { apiService } from '../utils/api';
const Budget: React.FC = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchBudgets();
  // }, []);

  // const fetchBudgets = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await apiService.getBudgets();
  //     setBudgets(response.budgets || []);
  //   } catch (error) {
  //     console.error('Error fetching budgets:', error);
  //     setBudgets([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
            <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Budget Planner</h1>
              <p className="text-sm text-slate-400">Set and track your spending limits</p>
            </div>
          </div>
          <div className="ml-auto">
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Budget</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Target className="w-6 h-6 text-yellow-400" />
              <span className="text-sm font-medium text-slate-300">Total Budget</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              ${budgets.reduce((sum, b) => sum + b.budget, 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="w-6 h-6 text-red-400" />
              <span className="text-sm font-medium text-slate-300">Total Spent</span>
            </div>
            <p className="text-3xl font-bold text-red-400">
              ${budgets.reduce((sum, b) => sum + b.spent, 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Calculator className="w-6 h-6 text-green-400" />
              <span className="text-sm font-medium text-slate-300">Remaining</span>
            </div>
            <p className="text-3xl font-bold text-green-400">
              ${(budgets.reduce((sum, b) => sum + b.budget, 0) - budgets.reduce((sum, b) => sum + b.spent, 0)).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-yellow-400">Category Budgets</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="text-slate-400 mt-2">Loading budgets...</p>
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-8">
              <Calculator className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-400">No budgets found. Create your first budget!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => {
                const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
                const remaining = budget.amount - budget.spent;
                
                return (
                  <div key={budget.id} className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-white">{budget.category}</h3>
                      <div className="text-right">
                        <p className="text-white font-semibold">${budget.spent?.toFixed(2) || '0.00'} / ${budget.amount}</p>
                        <p className={`text-sm ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${Math.abs(remaining).toFixed(2)} {remaining >= 0 ? 'remaining' : 'over budget'}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                      {percentage.toFixed(1)}% of budget used
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Budget;