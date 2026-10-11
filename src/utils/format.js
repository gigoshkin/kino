export function formatDay(date, month = 'long') {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month });
}

export function formatMeta(movie) {
  return [movie.genres[0]?.name, `${movie.runtimeMinutes} min`].filter(Boolean).join(' · ');
}

export function formatLongDate(date) {
  return new Date(`${date}T00:00:00`)
    .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    .replace(',', '');
}

export function formatShortDate(date) {
  const value = new Date(`${date}T00:00:00`);
  const weekday = value.toLocaleDateString('en-GB', { weekday: 'short' });
  const month = value.toLocaleDateString('en-US', { month: 'short' });

  return `${weekday} ${value.getDate()} ${month}`;
}

export function formatMoney(amount) {
  return `₾${Number(amount.toFixed(2))}`;
}
