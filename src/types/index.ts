export interface User {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  studentId: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  description: string;
}

export interface MonthlyReport {
  totalSpent: number;
  categoryBreakdown: { [key: string]: number };
  month: string;
  year: number;
}