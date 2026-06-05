import client from './axios';
import { Category } from '../types/category';

interface CategoryPayload {
  name: string;
  color: string;
  icon?: string;
}

export async function fetchCategories() {
  const response = await client.get<Category[]>('/categories');
  return response.data;
}

export async function createCategory(payload: CategoryPayload) {
  const response = await client.post<Category>('/categories', payload);
  return response.data;
}

export async function updateCategory(categoryId: string, payload: CategoryPayload) {
  const response = await client.put<Category>(`/categories/${categoryId}`, payload);
  return response.data;
}

export async function deleteCategory(categoryId: string) {
  await client.delete(`/categories/${categoryId}`);
}
