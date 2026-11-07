import bcrypt from 'bcrypt';

export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 8) throw new Error('Password minimal 8 karakter');
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password, passwordHash) {
  if (typeof password !== 'string' || typeof passwordHash !== 'string') return false;
  return bcrypt.compare(password, passwordHash);
}
