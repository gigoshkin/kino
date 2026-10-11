function pad(number) {
  return String(number).padStart(2, '0');
}

export function toDateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getNextDays(count = 7) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    return {
      value: toDateString(date),
      weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      day: date.getDate(),
    };
  });
}

export function toDays(dateStrings) {
  return dateStrings.map((value) => {
    const date = new Date(`${value}T00:00:00`);

    return {
      value,
      weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      day: date.getDate(),
    };
  });
}
