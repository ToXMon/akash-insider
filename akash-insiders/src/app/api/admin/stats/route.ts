import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const totalUsersStmt = db.prepare('SELECT COUNT(*) as c FROM users');
    const totalUsers = (totalUsersStmt.get() as { c: number }).c;
    const byMonth = db
      .prepare("SELECT strftime('%Y-%m', created_at) as m, COUNT(*) as c FROM users GROUP BY m ORDER BY m")
      .all() as Array<{ m: string; c: number }>;
    const byTech = db
      .prepare('SELECT technology as tech, COUNT(*) as c FROM user_expertise GROUP BY technology ORDER BY c DESC LIMIT 10')
      .all() as Array<{ tech: string; c: number }>;

    return NextResponse.json({ totalUsers, byMonth, byTech });
  } catch (_error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

