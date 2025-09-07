'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export type Stats = { totalUsers: number; byMonth: Array<{ m: string; c: number }>; byTech: Array<{ tech: string; c: number }> };
export type Profile = { id: number; name: string; email: string; website_url?: string; github_url?: string };

export function DashboardView({ stats, profiles }: { stats: Stats; profiles: Array<Profile> }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Profiles: {stats.totalUsers}</CardTitle>
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
                  <TableHead>Website</TableHead>
                  <TableHead>GitHub</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.slice(0, 10).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.email}</TableCell>
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

