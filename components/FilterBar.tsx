'use client';

import React from 'react';
import { 
  Compass, 
  Layers, 
  SlidersHorizontal, 
  Sparkles, 
  Square, 
  Smartphone, 
  Monitor, 
  Palette,
  ArrowUpDown,
  Check
} from 'lucide-react';
import { FilterOptions } from '@/types/photo';

interface FilterBarProps {
  category: string;
  onCategoryChange: (cat: string) => void;
  orientation: FilterOptions['orientation'];
  onOrientationChange: (orientation: FilterOptions['orientation']) => void;
  color: string;
  onColorChange: (color: string) => void;
  sortBy: FilterOptions['sortBy'];
  onSortByChange: (sort: FilterOptions['sortBy']) => void;
  totalCount: number;
}

const CATEGORIES = [
  'All',
  'Urban',
  'Nature',
  'Architecture',
  'Space',
  'Drone',
  'Macro',
  'People',
  'Food',
];

const COLOR_OPTIONS = [
  { label: 'All', hex: '' },
  { label: 'Violet', hex: '#8338ec' },
  { label: 'Cyan', hex: '#00b4d8' },
  { label: 'Emerald', hex: '#10b981' },
  { label: 'Amber', hex: '#e09f3e' },
  { label: 'Crimson', hex: '#ef233c' },
  { label: 'Dark', hex: '#0d1b2a' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  category,
  onCategoryChange,
  orientation,
  onOrientationChange,
  color,
  onColorChange,
  sortBy,
  onSortByChange,
  totalCount,
}) => {
  return (
    <div className="sticky top-18 z-30 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/5 py-3 transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Category Scrollable Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = (cat === 'All' && !category) || category.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md shadow-cyan-600/20 scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 dark:text-slate-300 dark:hover:text-white border border-slate-200/60 dark:border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Filter Controls: Orientation, Colors, Sorting */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-between md:justify-end">
          
          {/* Orientation Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full p-0.5">
            <button
              onClick={() => onOrientationChange('all')}
              title="All Orientations"
              className={`p-1.5 px-2 rounded-full text-xs font-semibold transition-all ${
                orientation === 'all' ? 'bg-white dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onOrientationChange('landscape')}
              title="Landscape (Horizontal 16:9)"
              className={`p-1.5 rounded-full transition-all ${
                orientation === 'landscape' ? 'bg-white dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOrientationChange('portrait')}
              title="Portrait (Vertical 9:16)"
              className={`p-1.5 rounded-full transition-all ${
                orientation === 'portrait' ? 'bg-white dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOrientationChange('square')}
              title="Square (1:1)"
              className={`p-1.5 rounded-full transition-all ${
                orientation === 'square' ? 'bg-white dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Filter Swatches */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full px-2 py-1">
            <Palette className="w-3 h-3 text-slate-500 dark:text-slate-400 mr-0.5" />
            {COLOR_OPTIONS.map((c) => {
              const isSelected = color === c.hex;
              return (
                <button
                  key={c.label}
                  onClick={() => onColorChange(isSelected ? '' : c.hex)}
                  title={`Filter by ${c.label}`}
                  className={`w-4 h-4 rounded-full border transition-transform relative flex items-center justify-center ${
                    isSelected ? 'scale-125 border-slate-900 dark:border-white ring-2 ring-cyan-500' : 'border-slate-300 dark:border-white/20 hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: c.hex || '#94a3b8',
                  }}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as FilterOptions['sortBy'])}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs rounded-full px-3 py-1.5 pr-6 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer font-semibold"
            >
              <option value="trending">🔥 Trending</option>
              <option value="popular">⚡ Most Downloaded</option>
              <option value="newest">✨ Newest Polled</option>
              <option value="curated">💎 Curated Picks</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Total Photos Badge */}
          <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
            {totalCount} photos
          </span>

        </div>

      </div>
    </div>
  );
};
