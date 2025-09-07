import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { z } from 'zod';
import { verifyAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const profileSchema = z.object({
  profile: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    role: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional(),
    home_address: z.string().optional(),
    bio: z.string().optional(),
    website_url: z.string().optional(),
    profile_photo: z.string().optional(),
    github_url: z.string().optional(),
    linkedin_url: z.string().optional(),
    twitter_url: z.string().optional(),
    telegram_url: z.string().optional(),
    hobbies: z.string().optional(),
  }),
  expertise: z.array(z.object({
    technology: z.string(),
    expertise_level: z.number().min(1).max(10),
    years_experience: z.number().min(0),
  })).optional().default([]),
});

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
    const { profile, expertise } = parsed.data;

    const insertUser = db.prepare(
      `INSERT INTO users (name, email, role, company, location, home_address, bio, website_url, profile_photo, github_url, linkedin_url, twitter_url, telegram_url, hobbies)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const info = insertUser.run(
      profile.name,
      profile.email,
      profile.role || 'member',
      profile.company || null,
      profile.location || null,
      profile.home_address || null,
      profile.bio || null,
      profile.website_url || null,
      profile.profile_photo || null,
      profile.github_url || null,
      profile.linkedin_url || null,
      profile.twitter_url || null,
      profile.telegram_url || null,
      profile.hobbies || null
    );

    const userId = Number(info.lastInsertRowid);

    if (expertise && expertise.length > 0) {
      const expertiseStmt = db.prepare('INSERT INTO user_expertise (user_id, technology, expertise_level, years_experience) VALUES (?, ?, ?, ?)');
      for (const exp of expertise) {
        expertiseStmt.run(userId, exp.technology, exp.expertise_level, exp.years_experience);
      }
    }

    return NextResponse.json({ message: 'Profile submitted', id: userId }, { status: 201 });
  } catch (error: unknown) {
    console.error('Profile submission error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Internal Server Error', error: message }, { status: 500 });
  }
}

