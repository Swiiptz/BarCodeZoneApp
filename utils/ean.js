// utils/ean.js
function checksum12(d12) {
  if (!/^\d{12}$/.test(d12)) return null;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const n = parseInt(d12[i], 10);
    sum += (i % 2 === 0) ? n : 3 * n;
  }
  const mod = sum % 10;
  return (10 - mod) % 10;
}

export function normalizeEAN13(input) {
  const digits = String(input || '').replace(/\D/g, '');
  if (digits.length === 12) {
    const c = checksum12(digits);
    return c == null ? null : digits + String(c);
  }
  if (digits.length === 13) {
    const c = checksum12(digits.slice(0, 12));
    if (c == null) return null;
    return c === parseInt(digits[12], 10) ? digits : null;
  }
  return null;
}
