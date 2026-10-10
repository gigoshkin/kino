const API_URL = import.meta.env.VITE_API_URL;

export async function getNowPlaying() {
  const response = await fetch(`${API_URL}/movies/now-playing`);

  if (!response.ok) {
    throw new Error('Failed to fetch now playing movies');
  }

  const result = await response.json();
  return result;
}

export async function getSearchResults(q, signal) {
  const params = new URLSearchParams({ q });
  const response = await fetch(`${import.meta.env.VITE_API_URL}/search?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`Search failed (${response.status})`);
  }

  const json = await response.json();
  return json.data;
}
