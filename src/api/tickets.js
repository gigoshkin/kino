import { request } from './client';

export async function getTickets(filter) {
  const result = await request('/tickets', { params: { filter } });
  return result.data;
}

export async function refundOrder(reference) {
  const result = await request(`/orders/${reference}/refund`, { method: 'POST' });
  return result.data;
}
