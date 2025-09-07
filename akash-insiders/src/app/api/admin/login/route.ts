import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminToken, findAdminByEmail, verifyPassword } from '@/lib/auth';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(4) });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }
    const { email, password } = parsed.data;
    const admin = findAdminByEmail(email);
    if (!admin) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    const ok = await verifyPassword(password, admin.password_hash);
    if (!ok) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    const token = await createAdminToken({ sub: String(admin.id), email: admin.email, name: admin.name, role: 'admin' });
    const res = NextResponse.json({ message: 'ok' });
    res.cookies.set('admin-token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (_error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

