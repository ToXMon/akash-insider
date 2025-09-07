import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { verifyAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    try {
      await verifyAdminToken(token);
    } catch {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const totalUsersStmt = db.prepare('SELECT COUNT(*) as c FROM users');
    const totalUsers = (totalUsersStmt.get() as { c: number }).c;
    const byMonth = db
      .prepare("SELECT strftime('%Y-%m', created_at) as m, COUNT(*) as c FROM users GROUP BY m ORDER BY m")
      .all() as Array<{ m: string; c: number }>;
    const byTech = db
      .prepare('SELECT technology as tech, COUNT(*) as c FROM user_expertise GROUP BY technology ORDER BY c DESC LIMIT 10')
      .all() as Array<{ tech: string; c: number }>;

    const byRole = db
      .prepare('SELECT role, COUNT(*) as c FROM users GROUP BY role ORDER BY c DESC')
      .all() as Array<{ role: string; c: number }>;
    const byLocation = db
      .prepare('SELECT location, COUNT(*) as c FROM users WHERE location IS NOT NULL GROUP BY location ORDER BY c DESC LIMIT 10')
      .all() as Array<{ location: string; c: number }>;
    const avgExperience = db
      .prepare('SELECT AVG(years_experience) as avg FROM user_expertise')
      .get() as { avg: number };
    const expertiseLevels = db
      .prepare('SELECT expertise_level, COUNT(*) as c FROM user_expertise GROUP BY expertise_level ORDER BY expertise_level')
      .all() as Array<{ expertise_level: number; c: number }>;

    return NextResponse.json({ totalUsers, byMonth, byTech, byRole, byLocation, avgExperience: avgExperience.avg, expertiseLevels });
  } catch (_error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

