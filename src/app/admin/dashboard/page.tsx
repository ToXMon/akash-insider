import { DashboardView, type Stats, type Profile as ProfileType } from '@/components/admin/dashboard-view';

async function getStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/stats`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load stats');
  return res.json() as Promise<{ totalUsers: number; byMonth: Array<{ m: string; c: number }>; byTech: Array<{ tech: string; c: number }> }>;
}

export default async function DashboardPage() {
  const stats = await getStats();
  const { profiles } = await getProfiles();
  return <DashboardView stats={stats as Stats} profiles={profiles as Array<ProfileType>} />;
}

type Profile = { id: number; name: string; email: string; website_url?: string; github_url?: string };
async function getProfiles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/profiles`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load profiles');
  return res.json() as Promise<{ profiles: Array<Profile> }>;
}

// No client component here

