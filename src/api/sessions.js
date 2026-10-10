import { request } from './client';

export async function getFilterOptions() {
  const result = await request('/filter-options');
  return result.data;
}

export function getSessions(params) {
  return request('/sessions', { params });
}

export async function getSession(id) {
  const result = await request(`/sessions/${id}`);
  return result.data;
}

export async function getSeats(id) {
  const result = await request(`/sessions/${id}/seats`);
  return result.data;
}

export async function createHold(sessionId, seats) {
  const result = await request(`/sessions/${sessionId}/holds`, { method: 'POST', body: { seats } });
  return result.data;
}

export function releaseHold(holdId) {
  return request(`/holds/${holdId}`, { method: 'DELETE' });
}

export async function createOrder(order) {
  const result = await request('/orders', { method: 'POST', body: order });
  return result.data;
}
