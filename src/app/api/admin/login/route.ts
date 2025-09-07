import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminToken, findAdminByEmail, verifyPassword } from '@/lib/auth';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(4) });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Login validation failed:', parsed.error);
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }
    const { email, password } = parsed.data;
    
    console.log('Login attempt for:', email);
    
    const admin = findAdminByEmail(email);
    if (!admin) {
      console.error('Admin not found for email:', email);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    
    const ok = await verifyPassword(password, admin.password_hash);
    if (!ok) {
      console.error('Password verification failed for:', email);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createAdminToken({ sub: String(admin.id), email: admin.email, name: admin.name, role: 'admin' });
    const res = NextResponse.json({ message: 'ok' });
    res.cookies.set('admin-token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
    
    console.log('Login successful for:', email);
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

