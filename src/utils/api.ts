const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

// Dummy credentials for login (temporary - can be removed when backend auth is ready)
export const DUMMY_CREDENTIALS = {
  email: 'student@university.edu',
  password: 'password123'
};

export const apiService = {
  // Authentication endpoints
  login: async (email: string, password: string) => {
    try {
      // Try backend authentication first
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          user: data.user,
          token: data.token
        };
      }
    } catch (error) {
      console.log('Backend not available, using dummy credentials');
    }
    
    // Fallback to dummy credentials for demo
    if (email === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password) {
      return {
        success: true,
        user: {
          id: '1',
          name: 'John Doe',
          email: 'student@university.edu',
          memberSince: '2023-01-15',
          studentId: 'STU2023001'
        }
      };
    }
    throw new Error('Invalid credentials');
  },

  signup: async (userData: {
    name: string;
    email: string;
    studentId: string;
    password: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create account');
    }
    
    return response.json();
  },

  // User profile endpoints
  getUserProfile: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return response.json();
  },

  updateUserProfile: async (userId: string, userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return response.json();
  },

  // Transaction endpoints
  getTransactions: async (filters: {
    year?: number;
    month?: number;
    date?: string;
    type?: 'income' | 'expense' | 'all';
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/transactions?${queryParams}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    return response.json();
  },

  addTransaction: async (transactionData: {
    amount: number;
    category: string;
    type: 'income' | 'expense';
    description: string;
    date: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add transaction');
    }
    
    return response.json();
  },

  updateTransaction: async (transactionId: string, transactionData: any) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update transaction');
    }
    
    return response.json();
  },

  deleteTransaction: async (transactionId: string) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete transaction');
    }
    
    return response.json();
  },

  // Reports and analytics endpoints
  getMonthlyReport: async (month: number, year: number) => {
    const response = await fetch(`${API_BASE_URL}/reports/monthly?month=${month}&year=${year}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch monthly report');
    }
    
    return response.json();
  },

  getAnalytics: async (period: 'week' | 'month' | 'quarter' | 'year') => {
    const response = await fetch(`${API_BASE_URL}/analytics?period=${period}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    
    return response.json();
  },

  getCategoryBreakdown: async (period: 'week' | 'month' | 'quarter' | 'year') => {
    const response = await fetch(`${API_BASE_URL}/analytics/categories?period=${period}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch category breakdown');
    }
    
    return response.json();
  },

  // Budget endpoints
  getBudgets: async () => {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch budgets');
    }
    
    return response.json();
  },

  addBudget: async (budgetData: {
    category: string;
    amount: number;
    period: 'monthly' | 'weekly' | 'yearly';
  }) => {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(budgetData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add budget');
    }
    
    return response.json();
  },

  updateBudget: async (budgetId: string, budgetData: any) => {
    const response = await fetch(`${API_BASE_URL}/budgets/${budgetId}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(budgetData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update budget');
    }
    
    return response.json();
  },

  deleteBudget: async (budgetId: string) => {
    const response = await fetch(`${API_BASE_URL}/budgets/${budgetId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete budget');
    }
    
    return response.json();
  },

  // AI Chat Bot endpoint
  askBot: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/bot/query`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get bot response');
    }
    
    return response.json();
  },

  // Categories endpoint
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return response.json();
  },

  // Settings endpoints
  getUserSettings: async () => {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    
    return response.json();
  },

  updateUserSettings: async (settings: {
    notifications?: boolean;
    darkMode?: boolean;
    currency?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
    
    return response.json();
  },

  // Export data endpoint
  exportData: async (format: 'csv' | 'json' | 'pdf') => {
    const response = await fetch(`${API_BASE_URL}/export?format=${format}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to export data');
    }
    
    return response.blob();
  }
};