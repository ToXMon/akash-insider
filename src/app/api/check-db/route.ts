import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    // Get all users with their expertise
    const users = db.prepare(`
      SELECT
        u.*,
        GROUP_CONCAT(ue.technology || ' (' || ue.expertise_level || '/10, ' || ue.years_experience || 'y)') as expertise
      FROM users u
      LEFT JOIN user_expertise ue ON u.id = ue.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `).all();

    return NextResponse.json({
      success: true,
      total_users: users.length,
      users: users
    });
  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
