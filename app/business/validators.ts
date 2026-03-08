export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidName(name: string) {
  return /^[A-Za-zÀ-ÿ\s]{3,150}$/.test(name);
}

export function isNumericString(s: string) {
  return /^[0-9]+$/.test(s);
}
