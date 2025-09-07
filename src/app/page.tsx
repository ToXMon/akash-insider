import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/profile-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Akash Insiders - Community Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
