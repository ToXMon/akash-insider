'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

const skillOptions = [
  'Cloud Computing',
  'Web Development',
  'AI/ML',
  'Cybersecurity',
  'UI/UX Design',
  'Startups',
  'Blockchain',
  'Mobile Development',
  'DevOps',
  'Data Science',
  'Open Source',
  'Investing',
];

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  bio: z.string().max(500).optional().or(z.literal('')),
  twitter_url: z.string().url().optional().or(z.literal('')),
  telegram_url: z.string().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  website_url: z.string().url().optional().or(z.literal('')),
  interests: z.array(z.string()).min(0).default([]),
  skills: z.array(z.string()).min(0).default([]),
});

type ProfileFormValues = z.input<typeof profileSchema>;

export function ProfileForm() {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      interests: [],
      skills: [],
      twitter_url: '',
      telegram_url: '',
      github_url: '',
      linkedin_url: '',
      website_url: '',
    },
  });

  const [skillInput, setSkillInput] = React.useState('');

  async function onSubmit(values: ProfileFormValues) {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Your profile has been submitted!', variant: 'success' });
        form.reset();
      } else {
        toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
      }
    } catch (_e) {
      toast({ title: 'Network Error', description: 'Please try again later.', variant: 'destructive' });
    }
  }

  function addSkillChip() {
    const value = skillInput.trim();
    if (!value) return;
    const current = form.getValues('skills') || [];
    if (!current.includes(value)) {
      form.setValue('skills', [...current, value]);
    }
    setSkillInput('');
  }

  function removeSkillChip(skill: string) {
    const current = form.getValues('skills') || [];
    form.setValue('skills', current.filter((s) => s !== skill));
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea placeholder="Tell us about yourself" rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="twitter_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter</FormLabel>
              <FormControl>
                <Input placeholder="@username or https://twitter.com/username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telegram_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram</FormLabel>
              <FormControl>
                <Input placeholder="@username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="github_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedin_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input placeholder="https://linkedin.com/in/username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://your.site" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormItem>
          <FormLabel>Interests</FormLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {skillOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <Checkbox
                  checked={(form.getValues('interests') || []).includes(opt)}
                  onCheckedChange={(checked) => {
                    const current = form.getValues('interests') || [];
                    if (checked) {
                      form.setValue('interests', Array.from(new Set([...current, opt])));
                    } else {
                      form.setValue('interests', current.filter((i) => i !== opt));
                    }
                  }}
                  aria-label={opt}
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </FormItem>

        <FormItem>
          <FormLabel>Skills</FormLabel>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkillChip();
                  }
                }}
              />
              <Button type="button" onClick={addSkillChip}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.watch('skills') || []).map((skill) => (
                <Badge key={skill} className="flex items-center gap-1">
                  {skill}
                  <button type="button" aria-label={`Remove ${skill}`} onClick={() => removeSkillChip(skill)}>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </FormItem>
      </div>

      <Button type="submit" className="w-full md:w-auto">Submit Profile</Button>
      </form>
    </Form>
  );
}

