import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function generateToken(user) {
  return jwt.sign({
    login: user.login,
    grupuser: user.grupuser,
    poli: user.poli ?? null
  }, env.jwtSecret, { expiresIn: env.jwtExpiresIn, noTimestamp: true });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

// Explicit descriptive aliases retained for controller/middleware readability.
export const signAccessToken = generateToken;
export const verifyAccessToken = verifyToken;
