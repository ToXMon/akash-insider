import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  bio: z.string().optional().or(z.literal('')),
  twitter_url: z.string().optional().or(z.literal('')),
  telegram_url: z.string().optional().or(z.literal('')),
  github_url: z.string().optional().or(z.literal('')),
  linkedin_url: z.string().optional().or(z.literal('')),
  website_url: z.string().optional().or(z.literal('')),
  interests: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
});

export async function GET() {
  try {
    const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
    return NextResponse.json({ profiles: users });
  } catch (_error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
    }
    const v = parsed.data;

    const insertUser = db.prepare(
      `INSERT INTO users (name, email, role, bio, website_url, github_url, linkedin_url, twitter_url, telegram_url)
       VALUES (?, ?, 'member', ?, ?, ?, ?, ?, ?)`
    );
    const info = insertUser.run(
      v.name,
      v.email,
      v.bio || null,
      v.website_url || null,
      v.github_url || null,
      v.linkedin_url || null,
      v.twitter_url || null,
      v.telegram_url || null
    );

    const userId = Number(info.lastInsertRowid);

    const expertiseStmt = db.prepare('INSERT INTO user_expertise (user_id, technology, expertise_level, years_experience) VALUES (?, ?, ?, ?)');
    const interests = Array.isArray(v.interests) ? v.interests : [];
    for (const tech of interests) {
      expertiseStmt.run(userId, tech, 5, 1);
    }

    return NextResponse.json({ message: 'Profile submitted', id: userId }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

