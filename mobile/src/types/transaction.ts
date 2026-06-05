export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  categoryId?: string;
  date: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface TransactionCreatePayload {
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  type: TransactionType;
}
