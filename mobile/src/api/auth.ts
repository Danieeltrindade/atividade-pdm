import client from './axios';
import { AuthResponse } from '../types/auth';

interface LoginPayload {
  email: string;
  password: string;
}

export async function loginRequest(payload: LoginPayload) {
  const response = await client.post<AuthResponse>('/auth/login', payload);
  return response.data;
}

export async function profileRequest() {
  const response = await client.get<AuthResponse['user']>('/auth/me');
  return response.data;
}
