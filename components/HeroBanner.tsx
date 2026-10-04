'use client';

import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, Compass, Zap, ShieldCheck, Flame } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTag: (tag: string) => void;
}

const TRENDING_TAGS = [
  { label: 'Cyberpunk Tokyo', icon: Flame },
  { label: 'Alpine Mountains', icon: Compass },
  { label: 'Minimalist Architecture', icon: Sparkles },
  { label: 'Emerald Ocean Waves', icon: TrendingUp },
  { label: 'Space & Nebula', icon: Zap },
  { label: 'Cinematic Portrait', icon: Sparkles },
  { label: 'Drone Aerials', icon: Compass },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  onSelectTag,
}) => {
  const [inputVal, setInputVal] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(inputVal);
  };

  return (
    <div className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-white/5 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 transition-colors duration-200">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-gradient-to-tr from-cyan-400/20 via-blue-400/15 to-indigo-400/20 dark:from-cyan-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-0 right-10 w-72 h-72 bg-cyan-200/30 dark:bg-blue-500/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="relative max-w-4xl mx-auto text-center">
        
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-slate-800/80 border border-cyan-200 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
          <span>Polled Live from Open Web Photo Networks & 4K Catalog</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">
          The Free Stock Photo Platform{' '}
          <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 dark:from-cyan-400 dark:via-sky-300 dark:to-indigo-400 bg-clip-text text-transparent">
            Powered by Web Feeds
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Over 10M+ authentic high-resolution stock photos polled directly from top creators. Free for personal & commercial use with camera EXIF details and color palettes.
        </p>

        {/* Central Search Form */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center shadow-xl shadow-slate-200/50 dark:shadow-cyan-950/60 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/20 bg-white dark:bg-slate-900/90 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-500/20 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-4 pointer-events-none shrink-0" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                onSearchChange(e.target.value);
              }}
              placeholder="Search by keyword, mood, location, color, or camera..."
              className="w-full bg-transparent px-4 py-4 text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
            />
            <button
              type="submit"
              className="m-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-md active:scale-95 shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Trending Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
            <TrendingUp className="w-3 h-3 text-cyan-600 dark:text-cyan-400" /> Trending:
          </span>
          {TRENDING_TAGS.map((tag) => {
            const Icon = tag.icon;
            return (
              <button
                key={tag.label}
                onClick={() => {
                  setInputVal(tag.label);
                  onSelectTag(tag.label);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 border border-slate-200 dark:border-white/5 shadow-xs transition-all"
              >
                <Icon className="w-3 h-3 text-slate-400" />
                <span>{tag.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
