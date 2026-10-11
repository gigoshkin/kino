export function formatDay(date, month = 'long') {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month });
}

export function formatMeta(movie) {
  return [movie.genres[0]?.name, `${movie.runtimeMinutes} min`].filter(Boolean).join(' · ');
}
