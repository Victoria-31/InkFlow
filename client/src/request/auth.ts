import type { CurrentAccount, LoginInput, LoginResult } from '@inkflow/shared';
import { http } from './http';

export async function login(credentials: LoginInput) {
  const { data } = await http.post<LoginResult>('/auth/login', credentials);
  return data;
}

export async function logout() {
  await http.post('/auth/logout');
}

export async function getCurrentAccount() {
  const { data } = await http.get<CurrentAccount>('/auth/me');
  return data;
}
