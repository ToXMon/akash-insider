'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const schema = z.object({ email: z.string().email(), password: z.string().min(4) });

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  async function handleLogin() {
    console.log('Login button clicked');
    
    const email = 'admin@akash.network';
    const password = 'admin123';
    
    console.log('Attempting login with:', { email, password: '***' });
    
    try {
      const res = await fetch('/api/admin/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, password }) 
      });
      
      console.log('Response status:', res.status);
      
      if (res.ok) {
        console.log('Login successful!');
        toast({ title: 'Logged in successfully!', variant: 'success' });
        router.push('/admin/dashboard');
      } else {
        const errorData = await res.json();
        console.log('Login failed:', errorData);
        toast({ title: errorData.message || 'Login failed', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Network error:', error);
      toast({ title: 'Network error', variant: 'destructive' });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
        <p className="text-sm text-gray-600 mb-4">
          Click the button below to login with default credentials
        </p>
        <Button onClick={handleLogin} className="w-full">
          Login as Admin
        </Button>
      </div>
    </div>
  );
}

