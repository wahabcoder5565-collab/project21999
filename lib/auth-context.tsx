'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types/photo';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password?: string, username?: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  toggleAdminRole: () => void;
}

const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user-001',
  email: 'alex.creator@luminastock.com',
  username: 'alexcreator',
  fullName: 'Alex River',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  bio: 'Visual artist & landscape photographer based in Vancouver.',
  location: 'Vancouver, Canada',
  website: 'https://alexriver.photography',
  role: 'admin',
  totalUploads: 6,
  totalDownloads: 1420,
  totalLikes: 385,
  createdAt: '2026-01-15T10:00:00Z'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage or Supabase
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email || '' });
            const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (data) {
              setProfile(data);
            }
          }
        } else {
          // Local fallback session
          const savedProfile = localStorage.getItem('lumina_auth_profile');
          if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            setProfile(parsed);
            setUser({ id: parsed.id, email: parsed.email });
          } else {
            // Pre-seed default logged in creator profile
            setProfile(DEFAULT_USER_PROFILE);
            setUser({ id: DEFAULT_USER_PROFILE.id, email: DEFAULT_USER_PROFILE.email });
            localStorage.setItem('lumina_auth_profile', JSON.stringify(DEFAULT_USER_PROFILE));
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password?: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'password123',
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || email });
        }
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }

    // Local authentication
    const newProf: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      id: `user-${Date.now()}`,
      email,
      username: email.split('@')[0],
      fullName: email.split('@')[0].replace('.', ' '),
    };
    setUser({ id: newProf.id, email });
    setProfile(newProf);
    localStorage.setItem('lumina_auth_profile', JSON.stringify(newProf));
    return { success: true };
  };

  const signUp = async (email: string, password?: string, username?: string, fullName?: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || 'password123',
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }

    const newProf: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      username: username || email.split('@')[0],
      fullName: fullName || 'New Creator',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: 'user',
      totalUploads: 0,
      totalDownloads: 0,
      totalLikes: 0,
      createdAt: new Date().toISOString(),
    };
    setUser({ id: newProf.id, email });
    setProfile(newProf);
    localStorage.setItem('lumina_auth_profile', JSON.stringify(newProf));
    return { success: true };
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('lumina_auth_profile');
  };

  const forgotPassword = async (email: string) => {
    return { success: true, message: `Password reset instructions sent to ${email}` };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem('lumina_auth_profile', JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').update(updates).eq('id', profile.id);
      } catch (err) {
        console.warn('Supabase profile update warning:', err);
      }
    }
  };

  const toggleAdminRole = () => {
    if (!profile) return;
    const newRole = profile.role === 'admin' ? 'user' : 'admin';
    updateProfile({ role: newRole });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin: profile?.role === 'admin',
        isLoading,
        signIn,
        signUp,
        signOut,
        forgotPassword,
        updateProfile,
        toggleAdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
