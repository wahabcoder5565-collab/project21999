'use client';

import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  Terminal, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPABASE_SCHEMA_SQL = `-- Supabase Database Schema for LuminaStock / Pexels Clone

CREATE TABLE IF NOT EXISTS public.photos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    preview_url TEXT NOT NULL,
    download_url TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    aspect_ratio NUMERIC NOT NULL,
    orientation TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    dominant_color TEXT DEFAULT '#3b82f6',
    color_palette TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    photographer JSONB NOT NULL DEFAULT '{}'::jsonb,
    exif JSONB DEFAULT '{}'::jsonb,
    source TEXT DEFAULT 'unsplash',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.collections (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    cover_image_url TEXT,
    photo_count INTEGER DEFAULT 0,
    photo_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.likes (
    id BIGSERIAL PRIMARY KEY,
    photo_id TEXT REFERENCES public.photos(id) ON DELETE CASCADE,
    user_identifier TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(photo_id, user_identifier)
);

CREATE TABLE IF NOT EXISTS public.downloads (
    id BIGSERIAL PRIMARY KEY,
    photo_id TEXT REFERENCES public.photos(id) ON DELETE CASCADE,
    resolution TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public photos viewable" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Public collections viewable" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public likes insert" ON public.likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public downloads insert" ON public.downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public photos insert" ON public.photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Public photos update" ON public.photos FOR UPDATE USING (true);
CREATE POLICY "Public collections insert" ON public.collections FOR INSERT WITH CHECK (true);
CREATE POLICY "Public collections update" ON public.collections FOR UPDATE USING (true);`;

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-y-auto"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Supabase Full-Stack Architecture</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                  isSupabaseConfigured 
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
                    : 'bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border-cyan-500/30'
                }`}>
                  {isSupabaseConfigured ? '🟢 Live Supabase Connected' : '⚡ Local-First Fallback Active'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">PostgreSQL tables for Photos, Collections, Likes & Downloads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Ready-to-Deploy Database Schema</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            The platform works out of the box with an in-memory high-res catalog, and automatically syncs all writes, likes, collections, and polled photos with your Supabase database when configured.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono bg-white dark:bg-slate-900/90 p-2.5 rounded-xl border border-slate-200 dark:border-white/5">
            <span className="text-cyan-700 dark:text-cyan-400 font-bold">.env.local:</span>
            <span>NEXT_PUBLIC_SUPABASE_URL=...</span>
            <span>NEXT_PUBLIC_SUPABASE_ANON_KEY=...</span>
          </div>
        </div>

        {/* Schema SQL Code */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>SQL Migration Script (supabase/schema.sql)</span>
            </span>
            <button
              onClick={handleCopySchema}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 text-xs font-bold transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied SQL!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-200 dark:border-white/5 text-[11px] font-mono overflow-x-auto max-h-64 scrollbar-thin">
            <code>{SUPABASE_SCHEMA_SQL}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Run this in your Supabase SQL Editor to set up tables and RLS policies.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
