import { DashboardView, type Stats, type Profile as ProfileType } from '@/components/admin/dashboard-view';
import { verifyAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getStats(token: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const url = `${baseUrl}/api/admin/stats`;
    console.log('Fetching stats from:', url);
    
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `admin-token=${token}`,
      }
    });
    
    if (!res.ok) {
      console.error('Stats API error:', res.status, res.statusText);
      throw new Error(`Failed to load stats: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Stats data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}

export default async function DashboardPage() {
  console.log('DashboardPage: Starting authentication check');
  
  // Verify authentication on the server side
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  
  if (!token) {
    console.log('DashboardPage: No token found, redirecting to login');
    redirect('/admin/');
  }
  
  try {
    await verifyAdminToken(token);
    console.log('DashboardPage: Token verified successfully');
  } catch (error) {
    console.log('DashboardPage: Token verification failed:', error);
    redirect('/admin/');
  }

  console.log('DashboardPage: Fetching data...');
  const stats = await getStats(token);
  const { profiles } = await getProfiles(token);
  
  console.log('DashboardPage: Data fetched successfully, rendering dashboard');
  return <DashboardView stats={stats as Stats} profiles={profiles as Array<ProfileType>} />;
}

type Profile = { id: number; name: string; email: string; role: string; location?: string; website_url?: string; github_url?: string; created_at: string };
async function getProfiles(token: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const url = `${baseUrl}/api/profiles`;
    console.log('Fetching profiles from:', url);
    
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `admin-token=${token}`,
      }
    });
    
    if (!res.ok) {
      console.error('Profiles API error:', res.status, res.statusText);
      throw new Error(`Failed to load profiles: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Profiles data received, count:', data.profiles?.length || 0);
    return data;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
}

// No client component here

