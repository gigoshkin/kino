export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(value) {
  const name = value.trim();

  if (!name) return 'Name is required';
  if (name.length < 3) return 'Name must be at least 3 characters';
  if (name.length > 50) return 'Name must not exceed 50 characters';

  return true;
}

export function validateMobile(value) {
  const number = value.replace(/\s/g, '');

  if (!number) return 'Mobile number is required';
  if (!/^\d+$/.test(number)) {
    return 'Please enter a valid Georgian mobile number (9 digits starting with 5)';
  }
  if (!number.startsWith('5')) return 'Georgian mobile numbers must start with 5';
  if (number.length !== 9) return 'Mobile number must be exactly 9 digits';

  return true;
}

export function validateCardNumber(value) {
  const digits = value.replace(/\s/g, '');

  if (!digits) return 'Card number is required';
  if (!/^\d{16}$/.test(digits)) return 'Card number must be 16 digits';

  return true;
}

export function validateExpiry(value) {
  if (!value) return 'Expiry is required';

  const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);

  if (!match) return 'Use the MM/YY format';

  const expires = new Date(2000 + Number(match[2]), Number(match[1]), 1);

  if (expires <= new Date()) return 'This card has expired';

  return true;
}

export function validateCvv(value) {
  if (!value) return 'CVV is required';
  if (!/^\d{3}$/.test(value)) return 'CVV must be 3 digits';

  return true;
}

export function formatCardNumber(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);

  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}
