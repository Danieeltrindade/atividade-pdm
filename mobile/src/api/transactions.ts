import client from './axios';
import { Transaction, TransactionCreatePayload } from '../types/transaction';

export async function fetchTransactions(params?: { month?: number; year?: number }) {
  const response = await client.get<Transaction[]>('/transactions', { params });
  return response.data;
}

export async function fetchSummary(params?: { month?: number; year?: number }) {
  const response = await client.get<{ totalIncome: number; totalExpense: number; balance: number; categories: Array<{ name: string; value: number }>; monthlyEvolution: Array<{ month: string; value: number }> }>('/transactions/summary', { params });
  return response.data;
}

export async function createTransaction(payload: TransactionCreatePayload) {
  const response = await client.post<Transaction>('/transactions', payload);
  return response.data;
}

export async function updateTransaction(id: string, payload: TransactionCreatePayload) {
  const response = await client.put<Transaction>(`/transactions/${id}`, payload);
  return response.data;
}

export async function deleteTransaction(id: string) {
  await client.delete(`/transactions/${id}`);
}
