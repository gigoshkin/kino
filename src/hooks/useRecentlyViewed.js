const STORAGE_KEY = 'kino_recently_viewed';
const MAX_ITEMS = 6;

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(movie) {
  const entry = {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    backdropUrl: movie.backdropUrl,
    posterUrl: movie.posterUrl,
    genres: movie.genres.slice(0, 1),
    runtimeMinutes: movie.runtimeMinutes,
    ageRating: movie.ageRating,
  };
  const others = getRecentlyViewed().filter((item) => item.id !== movie.id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...others].slice(0, MAX_ITEMS)));
}
