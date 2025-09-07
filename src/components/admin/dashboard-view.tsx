'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export type Stats = { 
  totalUsers: number; 
  byMonth: Array<{ m: string; c: number }>; 
  byTech: Array<{ tech: string; c: number }>; 
  byRole: Array<{ role: string; c: number }>; 
  byLocation: Array<{ location: string; c: number }>; 
  avgExperience: number; 
  expertiseLevels: Array<{ expertise_level: number; c: number }> 
};
export type Profile = { 
  id: number; 
  name: string; 
  email: string; 
  role: string; 
  location?: string; 
  website_url?: string; 
  github_url?: string; 
  created_at: string; 
};

export function DashboardView({ stats, profiles }: { stats: Stats; profiles: Array<Profile> }) {
  const router = useRouter();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
      
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgExperience ? stats.avgExperience.toFixed(1) : 'N/A'} years</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.byTech[0]?.tech || 'N/A'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Registrations Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.byMonth}>
                  <defs>
                    <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111827" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="c" stroke="#111827" fillOpacity={1} fill="url(#colorC)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byTech}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tech" tick={{ fontSize: 12 }} interval={0} angle={-20} height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="c" fill="#111827" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Roles Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byRole}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ role, c }) => `${role}: ${c}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="c"
                  >
                    {stats.byRole.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byLocation} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="location" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="c" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Expertise Levels Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.expertiseLevels}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="expertise_level" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="c" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>GitHub</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.slice(0, 10).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.role}</TableCell>
                    <TableCell>{p.location}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{p.website_url}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{p.github_url}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

