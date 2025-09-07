import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcrypt';
import { db } from './database';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-akash');

export type AdminTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: 'admin';
};

export async function createAdminToken(payload: AdminTokenPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  return token;
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as AdminTokenPayload;
}

export function findAdminByEmail(email: string) {
  try {
    const result = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email) as
      | { id: number; email: string; name: string; password_hash: string }
      | undefined;
    console.log('findAdminByEmail result for', email, ':', result ? 'found' : 'not found');
    return result;
  } catch (error) {
    console.error('Database error in findAdminByEmail:', error);
    throw error;
  }
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

