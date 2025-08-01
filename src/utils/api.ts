const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://studget.onrender.com';
import axios from 'axios';

export const apiService = {
  // ✅ Authentication endpoints
  login: async (student_email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_email, password })
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        token: result.data.access_token,
        tokenType: result.data.token_type,
        message: result.message
      };
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    throw new Error('Login failed');
  }
},


  signup: async (userData: {
    student_name: string;
    student_email: string;
    password: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data?.detail?.[0]?.msg || data?.message || 'Failed to create account';
      throw new Error(msg);
    }

    return data;
  },

  // ✅ Profile
  getUserProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/profile/student_profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch user profile');

    return response.json();
  },

  updateUserProfile: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/profile/student_profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) throw new Error('Failed to update profile');

    return response.json();
  },

  // ✅ Transactions
getTransactions: async (filters: { student_id: string; year?: number; month?: number; curr_date?: string }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found');

    const response = await fetch(`${API_BASE_URL}/home/get_transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filters)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response not OK', errorText);
      throw new Error('Failed to fetch transactions');
    }

    return await response.json();
  } catch (error) {
    console.error('getTransactions error:', error);
    throw new Error('Failed to fetch transactions');
  }
},

  getMonthlyReport: async () => {
    const response = await fetch(`${API_BASE_URL}/profile/monthly_report`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch monthly report');

    return response.json();
  },

 // ✅ AI Chat Bot
  askBot: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/bot/studgetbot`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_query: query })
    });

    if (!response.ok) throw new Error('Failed to get bot response');

    return response.json();
  },
 // ✅ Monthly Summary
  getMonthlySummary: async () => {
    const response = await fetch(`${API_BASE_URL}/agent/prev_month_summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch monthly summary');

    return response.json();
  },


  // ✅ Monthly Summary
  getMonthlySummary: async () => {
    const response = await fetch(`http://127.0.0.1:8000/agent/prev_month_summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch monthly summary');

    return response.json();
  },

 addTransaction: async (transactionData: {
  transaction_amount: number;
  transaction_category: string;
  transaction_type: 'income' | 'expense';
  transaction_description: string;
  transaction_date: string;
}) => {

    const response = await fetch(`${API_BASE_URL}/home/add_transaction`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData)
    });

    if (!response.ok) throw new Error('Failed to add transaction');

    return response.json();
  },

setMonthlyLimit: async (limit: number) => {
  const token = localStorage.getItem("token"); // get token from storage
  try {
    const response = await axios.post(
      `${API_BASE_URL}/home/set_monthly_limit/${limit}`,
      {
        user_query: "Set my monthly budget",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ← this is required
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to set monthly limit:", error);
    throw error;
  }
},


getMonthlyLimit: async() => {
  const token = localStorage.getItem("token");
  try{
    const response = await axios.get(
      `${API_BASE_URL}/home/get_monthly_limit`,
      {
        headers:{
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch(error){
    console.error('Failed to fetch Monthly Limit:',error);
    throw error;
  }
},



getSpendingIndicator: async () => {
  const token = localStorage.getItem("token"); // ⬅️ get your saved token
  try {
    const response = await axios.get(
      `${API_BASE_URL}/home/get_spending_indicator`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ⬅️ add token here
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch spending indicator:', error);
    throw error;
  }
}




};

//   updateTransaction: async (transactionId: string, transactionData: any) => {
//     const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(transactionData)
//     });

//     if (!response.ok) throw new Error('Failed to update transaction');

//     return response.json();
//   },

//   deleteTransaction: async (transactionId: string) => {
//     const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) throw new Error('Failed to delete transaction');

//     return response.json();
//   },


//   getAnalytics: async (period: 'week' | 'month' | 'quarter' | 'year') => {
//     const response = await fetch(`${API_BASE_URL}/analytics?period=${period}`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) throw new Error('Failed to fetch analytics');

//     return response.json();
//   },

//   getCategoryBreakdown: async (period: 'week' | 'month' | 'quarter' | 'year') => {
//     const response = await fetch(`${API_BASE_URL}/analytics/categories?period=${period}`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) throw new Error('Failed to fetch category breakdown');

//     return response.json();
//   },

//   // ✅ Budgets
//   getBudgets: async () => {
//     const response = await fetch(`${API_BASE_URL}/budgets`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) throw new Error('Failed to fetch budgets');

//     return response.json();
//   },

//   addBudget: async (budgetData: {
//     category: string;
//     amount: number;
//     period: 'monthly' | 'weekly' | 'yearly';
//   }) => {
//     const response = await fetch(`${API_BASE_URL}/budgets`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(budgetData)
//     });

//     if (!response.ok) throw new Error('Failed to add budget');

//     return response.json();
//   },

//   updateBudget: async (budgetId: string, budgetData: any) => {
//     const response = await fetch(`${API_BASE_URL}/budgets/${budgetId}`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(budgetData)
//     });

//     if (!response.ok) throw new Error('Failed to update budget');

//     return response.json();
//   },

//   deleteBudget: async (budgetId: string) => {
//     const response = await fetch(`${API_BASE_URL}/budgets/${budgetId}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) throw new Error('Failed to delete budget');

//     return response.json();
//   },

//   // ✅ AI Chat Bot
//   askBot: async (query: string) => {
//     const response = await fetch(`${API_BASE_URL}/bot/studgetbot`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ query })
//     });

//     if (!response.ok) throw new Error('Failed to get bot response');

//     return response.json();
//   },

//   // ✅ Categories
//   getCategories: async () => {
//     const response = await fetch(`${API_BASE_URL}/categories`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) throw new Error('Failed to fetch categories');

//     return response.json();
//   },

//   // ✅ Settings
//   getUserSettings: async () => {
//     const response = await fetch(`${API_BASE_URL}/settings`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) throw new Error('Failed to fetch settings');

//     return response.json();
//   },

//   updateUserSettings: async (settings: {
//     notifications?: boolean;
//     darkMode?: boolean;
//     currency?: string;
//   }) => {
//     const response = await fetch(`${API_BASE_URL}/settings`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(settings)
//     });

//     if (!response.ok) throw new Error('Failed to update settings');

//     return response.json();
//   },

//   // ✅ Export
//   exportData: async (format: 'csv' | 'json' | 'pdf') => {
//     const response = await fetch(`${API_BASE_URL}/export?format=${format}`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) throw new Error('Failed to export data');

//     return response.blob();
//   }
// };
