import { request } from './client';

export async function getSearchResults(q, signal) {
  const result = await request('/search', { params: { q }, signal });
  return result.data;
}

export async function getNowPlaying(limit) {
  const result = await request('/movies/now-playing', { params: { limit } });
  return result.data;
}

export async function getComingSoon(limit) {
  const result = await request('/movies/coming-soon', { params: { limit } });
  return result.data;
}

export async function getFeatured() {
  const result = await request('/movies/featured');
  return result.data;
}

export async function getMovie(slug) {
  const result = await request(`/movies/${slug}`);
  return result.data;
}

export async function getMovieSessions(slug, date) {
  const result = await request(`/movies/${slug}/sessions`, { params: { date } });
  return result.data;
}

export function notifyMe(slug) {
  return request(`/movies/${slug}/notify`, { method: 'POST' });
}
