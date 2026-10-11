import { request } from './client';

export async function login(credentials) {
  const result = await request('/login', { method: 'POST', body: credentials });
  return result.data;
}

export async function register(formData) {
  const result = await request('/register', { method: 'POST', body: formData });
  return result.data;
}

export function logout() {
  return request('/logout', { method: 'POST' });
}

export async function getMe() {
  const result = await request('/me', { silentUnauthorized: true });
  return result.data;
}

export async function updateProfile(formData) {
  const result = await request('/profile', { method: 'PUT', body: formData });
  return result.data;
}
