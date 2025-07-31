import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../utils/api';
import Sidebar from './Sidebar';
import { 
  Menu, 
  User, 
  LogOut, 
  DollarSign,
  TrendingDown,
  Plus,
  Hash,
  CreditCard,
  Tag
} from 'lucide-react';
import { Transaction } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');
const [selectedDate, setSelectedDate] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions] = useState<Transaction[]>([]);
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(true);
const [monthlyReport, setMonthlyReport] = useState<{
  totalSpent: number;
  categoryBreakdown: Record<string, string>;
}>({
  totalSpent: 0,
  categoryBreakdown: {}
});

const [spendingIndicator, setSpendingIndicator] = useState<string | null>(null);
const [budgetLimit, setBudgetLimit] = useState<number>(0);
const [inputLimit, setInputLimit] = useState<string>('');
const [monthlyLimit, setMonthlyLimit] = useState<string>('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAddTransaction = () => {
    navigate('/add-transaction');
  };

  // const handleChatSubmit = async () => {
  //   if (!chatQuery.trim()) return;
    
  //   try {
  //     const response = await apiService.askBot(chatQuery);
  //     setChatResponse(response.answer || "I'm here to help with your finance questions!");
  //   } catch (error) {
  //     setChatResponse("Sorry, I'm having trouble connecting right now. Please try again later.");
  //   }
  // };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = [
    { value: '', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const fetchSpendingIndicator = async () => {
  try {
    const response = await apiService.getSpendingIndicator();
    setSpendingIndicator(response?.data?.spending_indicator ?? null);
  } catch (error) {
    console.error('Error fetching spending indicator:', error);
  }
};


const fetchMonthlyLimit = async() => {
  try{
    const response = await apiService.getMonthlyLimit();
    setMonthlyLimit(response?.data?.monthly_limit ?? null);
  }catch(error){
    console.error('Error fetching monthly limit:',error);
  }
};



const getBudgetStatus = () => {
  switch (spendingIndicator) {
    case 'Green':
      return { status: 'Within Budget', color: 'bg-green-500' };
    case 'Orange':
      return { status: 'Over Budget', color: 'bg-orange-500' };
    case 'Red':
    case 'Critical':
      return { status: 'Critically Over Budget', color: 'bg-red-500' };
    default:
      return { status: 'Unknown', color: 'bg-gray-500' };
  }
};

useEffect(()=>{
  fetchMonthlyLimit();
},[]);

useEffect(() => {
  fetchSpendingIndicator();
}, []);


  useEffect(() => {
    fetchTransactions();
  }, []);

const fetchTransactions = async () => {
  try {
    setLoading(true);

    if (!user?.studentId) {
      console.warn("Student ID not available yet.");
      return;
    }

    const response = await apiService.getTransactions({
      student_id: user.studentId,
       year: selectedYear,
      month: selectedMonth ? parseInt(selectedMonth) : undefined,
      curr_date: selectedDate || undefined
    });

    const transformed = (response.data || []).map((t: any) => ({
      id: String(t.transation_id),
      description: t.transaction_description,
      category: t.transaction_category,
      amount: Number(t.transaction_amount), 
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


useEffect(() => {
  fetchTransactions();
}, [selectedYear, selectedMonth, selectedDate]);



  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        const report = await apiService.getMonthlyReport();
        setMonthlyReport({
          totalSpent: report.data.monthly_spending || 0,
          categoryBreakdown: report.data.monthly_categorywise_spending || {}
        });
      } catch (error) {
        console.error('Error fetching monthly report:', error);
        setMonthlyReport({
          totalSpent: 0,
          categoryBreakdown: {}
        });
      }
    };
    
    fetchMonthlyReport();
  }, [transactions]);


//   useEffect(() => {
//   const fetchBudgetLimit = async () => {
//     try {
//       const response = await apiService.getBudgetLimit(); // You’ll define this later
//       setBudgetLimit(response.data.budget || 0);
//     } catch (error) {
//       console.error('Error fetching budget limit:', error);
//     }
//   };

//   fetchBudgetLimit();
// }, []);

const handleSetBudgetLimit = async () => {
  const value = parseFloat(inputLimit);
  if (!isNaN(value)) {
    try {
      await apiService.setMonthlyLimit(value);
      setMonthlyLimit(value.toString()); // Update UI immediately
      await fetchSpendingIndicator(); // Optional extra fetch
      console.log('Monthly limit set successfully');
    } catch (error) {
      console.error('Error setting monthly limit:', error);
    }
  }
};




  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Student Finance Manager</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 px-3 py-2 rounded-lg transition-colors"
            >
              <User className="w-5 h-5 text-blue-400" />
              <span className="text-sm">{user?.name}</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-red-400"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column - Transaction Filters and Table */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Date Filters and Add Button */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-blue-400">Transaction Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Action</label>
                  <button
                    onClick={handleAddTransaction}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Transaction Table */}
              <div className="bg-slate-700/30 rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-600/50 border-b border-slate-600">
                  <div className="flex items-center space-x-2 font-semibold text-slate-200">
                    <Hash className="w-4 h-4" />
                    <span>Transaction ID</span>
                  </div>
                  <div className="flex items-center space-x-2 font-semibold text-slate-200">
                    <DollarSign className="w-4 h-4" />
                    <span>Transaction Amount</span>
                  </div>
                  <div className="flex items-center space-x-2 font-semibold text-slate-200">
                    <Tag className="w-4 h-4" />
                    <span>Transaction Category</span>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-8 text-center text-slate-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      <p>Loading transactions...</p>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No transactions found for the selected filters</p>
                    </div>
                  ) : (
                    transactions.map((transaction) => (
                      <div key={transaction.id} className="grid grid-cols-3 gap-4 p-4 border-b border-slate-600/50 hover:bg-slate-600/30 transition-colors">
                        <div className="text-blue-400 font-mono text-sm">
                          {transaction.id}
                        </div>
                        <div className={`font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </div>
                        <div className="text-slate-300">
                          <span className="bg-slate-600 px-2 py-1 rounded text-xs">
                            {transaction.category}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-blue-400">Monthly Report</h2>
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-slate-300">Total Spent in Current Month</span>
                  </div>
                     <p className="text-2xl font-bold text-white">
                       ₹{monthlyReport.totalSpent.toFixed(2)}
                      </p>
                   </div>

                 { /* Set Monthly Limit */}
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-slate-300">Set Monthly Budget Limit</span>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={inputLimit}
                      onChange={(e) => setInputLimit(e.target.value)}
                      placeholder="Enter limit in ₹"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                   <button
  onClick={handleSetBudgetLimit}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
>
  Set
</button>

                  </div>
                  <br/>
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-slate-300">Current Monthly Limit :</span>
                    <p className="text-2xl font-bold text-white">
                       ₹{monthlyLimit}
                      </p>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-medium text-slate-300">Budget Status</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`h-4 w-4 rounded-full ${getBudgetStatus().color}`}></div>
                    <span className="text-white font-medium">{getBudgetStatus().status}</span>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-orange-400" />
                    <span className="text-sm font-medium text-slate-300">Category Wise Spent</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(monthlyReport.categoryBreakdown).length === 0 ? (
                      <p className="text-slate-400 text-sm">No category data available</p>
                    ) : (
                      Object.entries(monthlyReport.categoryBreakdown).map(([rawKey, amount], index) => {
                        const match = rawKey.match(/^\d+:(.+)$/);
                        const category = match ? match[1] : rawKey;

                        return (
                          <div key={rawKey} className="flex justify-between items-center">
                            <span className="text-slate-400 mr-2">{index + 1}.</span>
                            <span className="bg-blue-600 text-xs px-2 py-1 rounded">{category}</span>
                            <span className="text-white font-medium ml-auto">₹{Number(amount).toFixed(2)}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </div>
  );
};

export default Dashboard;