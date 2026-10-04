'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Search, 
  Upload, 
  Bookmark, 
  Database, 
  Sparkles, 
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  User,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenUpload: () => void;
  onOpenCollections: () => void;
  onOpenSupabase: () => void;
  onOpenAuth: (initialTab?: 'signin' | 'signup') => void;
  onPollLive: () => void;
  isPolling: boolean;
  collectionsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenUpload,
  onOpenCollections,
  onOpenSupabase,
  onOpenAuth,
  onPollLive,
  isPolling,
  collectionsCount,
}) => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-pink-600 dark:bg-pink-900 backdrop-blur-md border-b border-pink-700/80 dark:border-pink-500/30 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => onSearchChange('')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-300 via-white to-pink-200 p-[2px] flex items-center justify-center shadow-md shadow-pink-300/30">
            <div className="w-full h-full bg-white dark:bg-pink-950 rounded-[10px] flex items-center justify-center">
              <Camera className="w-5 h-5 text-pink-600 dark:text-pink-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">
                Wahab<span className="text-pink-200">Stocks</span>
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/15 text-white border border-white/20">
                LIMITED
              </span>
            </div>
          </div>
        </Link>

        {/* Global Instant Search Bar */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-pink-300 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                onSearchChange(e.target.value);
              }}
              placeholder="Search high-res stock photos, aesthetics, colors, themes..."
              className="w-full bg-white/90 dark:bg-pink-950/60 border border-pink-300/50 dark:border-pink-400/20 rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-pink-300 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all shadow-inner"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  onSearchChange('');
                }}
                className="absolute right-3 text-xs text-pink-400 hover:text-pink-700 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 border border-white/20 transition-all"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Live Web Poller Trigger */}
          <button
            onClick={onPollLive}
            disabled={isPolling}
            title="Poll fresh stock photos live from the web"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isPolling
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30 animate-pulse'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPolling ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isPolling ? 'Polling...' : 'Poll Fresh'}</span>
          </button>

          {/* Collections Drawer Button */}
          <button
            onClick={onOpenCollections}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
          >
            <Bookmark className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="hidden sm:inline">Collections</span>
            {collectionsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-indigo-600 text-[10px] text-white font-bold">
                {collectionsCount}
              </span>
            )}
          </button>

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-pink-600 hover:bg-pink-50 text-xs font-semibold shadow-md shadow-pink-900/20 transition-all active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Supabase Status Button */}
          <button
            onClick={onOpenSupabase}
            title="Supabase Database Configuration & Schema"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium transition-all"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xl:inline text-[11px]">Supabase</span>
          </button>

          {/* User Profile OR Sign In / Sign Up Buttons */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-white/10 hover:border-cyan-500 transition-all"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-white max-w-[90px] truncate hidden md:inline">
                  {profile?.fullName || user.email.split('@')[0]}
                </span>
                <img
                  src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover border border-cyan-500/30"
                />
              </button>

              {showUserMenu && (
                <div 
                  onClick={() => setShowUserMenu(false)}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 p-2 z-50 shadow-2xl border border-slate-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{profile?.fullName}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold">
                      {profile?.role || 'user'}
                    </span>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-cyan-50 dark:hover:bg-cyan-500/20 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Creator Dashboard</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/20 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Admin Console</span>
                    </Link>
                  )}

                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-medium text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('signin')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Log In</span>
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold shadow-sm transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up Free</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
