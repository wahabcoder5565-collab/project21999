'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  Bookmark, 
  Download, 
  Sparkles, 
  Eye, 
  ChevronDown, 
  Check,
  Maximize2 
} from 'lucide-react';
import { Photo } from '@/types/photo';

interface PhotoCardProps {
  photo: Photo;
  onSelectPhoto: (photo: Photo) => void;
  onToggleLike: (photoId: string) => void;
  onAddToCollection: (photo: Photo) => void;
  onDownload: (photo: Photo, resolution: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onSelectPhoto,
  onToggleLike,
  onAddToCollection,
  onDownload,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = (e: React.MouseEvent, res: string) => {
    e.stopPropagation();
    setDownloading(true);
    onDownload(photo, res);
    setTimeout(() => {
      setDownloading(false);
      setShowDownloadMenu(false);
    }, 800);
  };

  return (
    <div
      onClick={() => onSelectPhoto(photo)}
      className="masonry-item group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-cyan-500/40 transition-all duration-300 cursor-pointer"
      style={{
        backgroundColor: photo.dominantColor ? `${photo.dominantColor}15` : undefined,
      }}
    >
      {/* Aspect Ratio Skeleton Loader */}
      {!isLoaded && (
        <div 
          className="w-full animate-shimmer"
          style={{
            paddingBottom: `${(1 / (photo.aspectRatio || 1.5)) * 100}%`,
          }}
        />
      )}

      {/* Main Image */}
      <img
        src={photo.previewUrl || photo.url}
        alt={photo.title}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full object-cover transition-all duration-500 group-hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
        }`}
      />

      {/* Dark Gradient Overlay for high text readability on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 pointer-events-none">
        
        {/* Top Floating Action Bar */}
        <div className="flex items-center justify-between pointer-events-auto">
          {/* Category Tag */}
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-white/10 shadow">
            {photo.category}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Add to Collection Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCollection(photo);
              }}
              title="Add to Collection"
              className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md hover:bg-indigo-600 border border-white/10 flex items-center justify-center text-white transition-all active:scale-90"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>

            {/* Like Heart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(photo.id);
              }}
              title={photo.isLiked ? 'Unlike photo' : 'Like photo'}
              className={`w-8 h-8 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all active:scale-90 ${
                photo.isLiked 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-slate-900/80 text-white hover:bg-rose-500/80'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${photo.isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Floating Info & Download Bar */}
        <div className="flex items-center justify-between gap-2 pointer-events-auto">
          {/* Photographer Profile */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={photo.photographer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={photo.photographer.name}
              className="w-7 h-7 rounded-full object-cover border border-white/30 shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {photo.photographer.name}
              </p>
              <p className="text-[10px] text-slate-300 truncate">
                @{photo.photographer.username}
              </p>
            </div>
          </div>

          {/* Quick Download Button + Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDownloadMenu(!showDownloadMenu);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-slate-950/40 transition-all active:scale-95"
            >
              <Download className={`w-3 h-3 ${downloading ? 'animate-bounce' : ''}`} />
              <span>Download</span>
              <ChevronDown className="w-3 h-3 text-cyan-200 ml-0.5" />
            </button>

            {/* Download Resolution Menu */}
            {showDownloadMenu && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-full mb-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-1.5 z-50 text-xs shadow-2xl animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/10 mb-1">
                  Choose Resolution
                </div>
                <button
                  onClick={(e) => handleDownloadClick(e, 'original')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-500/20 text-slate-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center justify-between"
                >
                  <span className="font-semibold">Original 4K (RAW)</span>
                  <span className="text-[10px] text-slate-400">{photo.width}x{photo.height}</span>
                </button>
                <button
                  onClick={(e) => handleDownloadClick(e, 'large')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-500/20 text-slate-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center justify-between"
                >
                  <span className="font-semibold">Large (1080p)</span>
                  <span className="text-[10px] text-slate-400">HD</span>
                </button>
                <button
                  onClick={(e) => handleDownloadClick(e, 'medium')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-500/20 text-slate-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center justify-between"
                >
                  <span className="font-semibold">Medium (720p)</span>
                  <span className="text-[10px] text-slate-400">Web</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
