'use client'

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { X, Plus, User, Briefcase, MapPin, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const TECHNOLOGIES = [
  'Kubernetes', 'Docker', 'Go', 'JavaScript', 'TypeScript', 'React', 'Node.js',
  'Python', 'Rust', 'Solidity', 'DevOps', 'Cloud Computing', 'Blockchain',
  'Web3', 'gRPC', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'IPFS'
];

interface TechExpertise {
  technology: string;
  expertise_level: number; // 0 - 10 scale
  years_experience: number;
}

interface ProfileFormData {
  name: string;
  email: string;
  role: string;
  company: string;
  location: string;
  home_address: string;
  bio: string;
  website_url: string;
  profile_photo: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  telegram_url: string;
  hobbies: string;
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<ProfileFormData>({
    name: '',
    email: '',
    role: '',
    company: '',
    location: '',
    home_address: '',
    bio: '',
    website_url: '',
    profile_photo: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    telegram_url: '',
    hobbies: ''
  });

  const [expertise, setExpertise] = useState<TechExpertise[]>([]);
  // Use useRef to track the selected technology to avoid closure issues
  const selectedTechRef = useRef('');
  const [selectedTech, _setSelectedTech] = useState<string>('');
  
  // Wrapper function to update both ref and state
  const setSelectedTech = (tech: string) => {
    selectedTechRef.current = tech;
    _setSelectedTech(tech);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [newYears, setNewYears] = useState<number>(1);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoPreview(result);
        setProfile({ ...profile, profile_photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addTechnology = React.useCallback(() => {
    const tech = selectedTechRef.current.trim();
    console.log('Adding technology:', tech);
    
    if (!tech) {
      toast.error('Please select a technology first');
      return;
    }
    
    if (expertise.some(exp => exp.technology === tech)) {
      toast.error(`${tech} is already added`);
      return;
    }

    const years = Math.max(0, Math.min(50, Number.isFinite(newYears) ? newYears : 0));

    setExpertise(prev => [
      ...prev,
      {
        technology: tech,
        expertise_level: 5,
        years_experience: years,
      },
    ]);
    
    // Reset form
    setSelectedTech('');
    setNewYears(1);
    
    // Focus the select element after state update
    setTimeout(() => {
      const selectElement = document.querySelector('select') as HTMLSelectElement;
      if (selectElement) {
        selectElement.focus();
      }
    }, 0);
    
  }, [expertise, newYears]);

  const removeTechnology = (tech: string) => {
    setExpertise(expertise.filter(exp => exp.technology !== tech));
  };

  const updateExpertise = (tech: string, value: number) => {
    const clampedYears = Math.max(0, Math.min(50, Number.isFinite(value) ? value : 0));
    setExpertise(expertise.map(exp =>
      exp.technology === tech ? { ...exp, years_experience: clampedYears } : exp
    ));
  };

  const updateExpertiseLevel = (tech: string, level: number) => {
    const clamped = Math.max(1, Math.min(10, level));
    setExpertise(expertise.map(exp =>
      exp.technology === tech ? { ...exp, expertise_level: clamped } : exp
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (expertise.length === 0) {
      toast.error('Please add at least one technology expertise');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile, expertise }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        toast.success('Profile submitted successfully! Welcome to the Akash community.');
        // Reset form
        setProfile({
          name: '',
          email: '',
          role: '',
          company: '',
          location: '',
          home_address: '',
          bio: '',
          website_url: '',
          profile_photo: '',
          github_url: '',
          linkedin_url: '',
          twitter_url: '',
          telegram_url: '',
          hobbies: ''
        });
        setExpertise([]);
        setPhotoPreview('');
      } else {
        throw new Error(data.error || 'Failed to submit profile');
      }
    } catch (error: unknown) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      const message = error instanceof Error ? error.message : 'Failed to submit profile. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTechnologies = TECHNOLOGIES.filter(tech => 
    !expertise.find(exp => exp.technology === tech)
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-red-500 mb-2">AKASH INSIDERS</h1>
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <span className="border-b-2 border-red-500 pb-1">Overview</span>
            <span>Dashboard</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Community Profile
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Share your expertise and connect with fellow developers, validators, and contributors 
          in the Akash decentralized cloud ecosystem.
        </p>
      </div>

      {/* Success feedback handled via toast */}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              My Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="profile_photo">Profile Photo</Label>
              <div className="space-y-3">
                {photoPreview ? (
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 bg-white">
                      <img 
                        src={photoPreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Photo uploaded successfully</p>
                      <p className="text-xs text-gray-500">Your profile photo is ready</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPhotoPreview('');
                        setProfile({ ...profile, profile_photo: '' });
                        // Reset the file input
                        const fileInput = document.getElementById('profile_photo') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Upload your profile photo</p>
                        <p className="text-xs text-gray-500">JPG, PNG or GIF up to 10MB</p>
                      </div>
                      <div className="flex justify-center">
                        <label htmlFor="profile_photo" className="cursor-pointer">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => document.getElementById('profile_photo')?.click()}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Choose Photo
                          </Button>
                        </label>
                      </div>
                    </div>
                    <Input
                      id="profile_photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name/Nickname *</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="John Doe or JohnDev"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  placeholder="e.g., DevOps Engineer, Blockchain Developer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization</Label>
                <p className="text-xs text-muted-foreground mb-2">Leave blank if self-employed</p>
                <Input
                  id="company"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="San Francisco, CA"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="home_address">Home Address (optional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="home_address"
                    value={profile.home_address}
                    onChange={(e) => setProfile({ ...profile, home_address: e.target.value })}
                    placeholder="123 Main St, San Francisco, CA 94102"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Personal Website (optional)</Label>
              <Input
                id="website_url"
                type="url"
                value={profile.website_url}
                onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself and your experience with cloud computing, blockchain, or related technologies..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hobbies">Hobbies</Label>
              <Textarea
                id="hobbies"
                value={profile.hobbies}
                onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })}
                placeholder="What do you enjoy doing in your free time? Gaming, hiking, photography, music, etc..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Social Handles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="github"
                    value={profile.github_url}
                    onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                    placeholder="https://github.com/username"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    value={profile.linkedin_url}
                    onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twitter"
                    value={profile.twitter_url}
                    onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
                    placeholder="https://twitter.com/username"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telegram"
                    value={profile.telegram_url}
                    onChange={(e) => setProfile({ ...profile, telegram_url: e.target.value })}
                    placeholder="https://t.me/username"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Expertise */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Interests & Skills *
            </CardTitle>
            <p className="text-sm text-gray-600">
              Add technologies you have experience with and specify your years of experience
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Technology */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col md:flex-row gap-3 md:items-center"
                   onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTechnology(); } }}>
                <select
                  value={selectedTech}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('Selected tech change:', value);
                    setSelectedTech(value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTechnology();
                    }
                  }}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Select a technology"
                >
                  <option value="">Select a technology</option>
                  {availableTechnologies.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2 md:w-[200px]">
                  <Label htmlFor="new-years" className="text-xs text-muted-foreground">Years</Label>
                  <Input
                    id="new-years"
                    type="number"
                    min="0"
                    max="50"
                    value={newYears}
                    onChange={(e) => setNewYears(parseInt(e.target.value || '0'))}
                    className="h-10"
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    console.log('Add button clicked');
                    addTechnology();
                  }}
                  variant="destructive"
                  className={`shrink-0 transition-opacity ${!selectedTech ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:opacity-90'}`}
                  disabled={!selectedTech}
                  title={!selectedTech ? 'Select a technology first' : `Add ${selectedTech}`}
                  aria-label={!selectedTech ? 'Select a technology first' : `Add ${selectedTech}`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Choose a technology, set years, then click Add. You can fine-tune years below.
              </p>
              {expertise.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {expertise.map((exp) => (
                    <div key={`chip-${exp.technology}`} className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-3 pr-1 text-xs">
                      <span>{exp.technology} • {exp.years_experience}y</span>
                      <button
                        type="button"
                        onClick={() => removeTechnology(exp.technology)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-red-50 text-red-500"
                        aria-label={`Remove ${exp.technology}`}
                        title={`Remove ${exp.technology}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expertise List */}
            <div className="space-y-6">
              {expertise.map((exp, index) => (
                <div key={exp.technology} className="space-y-4">
                  {index > 0 && <Separator />}
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm">
                      {exp.technology}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTechnology(exp.technology)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`level-${exp.technology}`}>Expertise Level: {exp.expertise_level}/10</Label>
                        <span className="text-xs text-muted-foreground">Beginner — Expert</span>
                      </div>
                      <Slider
                        id={`level-${exp.technology}`}
                        min={1}
                        max={10}
                        step={1}
                        value={[exp.expertise_level]}
                        onValueChange={(val) => updateExpertiseLevel(exp.technology, val[0] ?? 1)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`years-${exp.technology}`}>
                        Years of Experience
                      </Label>
                      <Input
                        id={`years-${exp.technology}`}
                        type="number"
                        min="0"
                        max="50"
                        value={exp.years_experience}
                        onChange={(e) => updateExpertise(exp.technology, parseInt(e.target.value) || 0)}
                        className="w-full border-gray-200 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {expertise.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No technologies added yet. Add your first technology above!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting || expertise.length === 0}
            size="lg"
            className="px-8 bg-red-500 hover:bg-red-600 text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Join Community'}
          </Button>
        </div>
      </form>
    </div>
  );
}

