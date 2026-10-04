'use client';

import React from 'react';
import { Photo } from '@/types/photo';
import { PhotoCard } from './PhotoCard';
import { RefreshCw, SearchX, Sparkles, Image as ImageIcon } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  isLoading: boolean;
  onSelectPhoto: (photo: Photo) => void;
  onToggleLike: (photoId: string) => void;
  onAddToCollection: (photo: Photo) => void;
  onDownload: (photo: Photo, resolution: string) => void;
  onPollMore: () => void;
  isPolling: boolean;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  isLoading,
  onSelectPhoto,
  onToggleLike,
  onAddToCollection,
  onDownload,
  onPollMore,
  isPolling,
}) => {
  if (isLoading && photos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="masonry-columns">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="masonry-item rounded-2xl bg-slate-900/60 border border-white/5 animate-shimmer"
              style={{
                height: `${280 + (i % 3) * 80}px`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (photos.length === 0 && !isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-850 border border-white/10 flex items-center justify-center mx-auto mb-4 text-cyan-400">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No matching stock photos found</h3>
        <p className="text-sm text-slate-400 mb-6">
          Try a different keyword or category, or poll fresh high-res images directly from web sources.
        </p>
        <button
          onClick={onPollMore}
          disabled={isPolling}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isPolling ? 'animate-spin' : ''}`} />
          <span>{isPolling ? 'Polling Web Sources...' : 'Poll Web for Photos'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Masonry Columns */}
      <div className="masonry-columns">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onSelectPhoto={onSelectPhoto}
            onToggleLike={onToggleLike}
            onAddToCollection={onAddToCollection}
            onDownload={onDownload}
          />
        ))}
      </div>

      {/* Bottom Load More & Web Polling Banner */}
      <div className="mt-14 pb-12 flex flex-col items-center justify-center gap-4 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Showing {photos.length} curated & polled stock photos</span>
        </div>

        <button
          onClick={onPollMore}
          disabled={isPolling}
          className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-cyan-500/50 text-white text-sm font-semibold shadow-xl transition-all active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 text-cyan-400 ${isPolling ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
          <span>{isPolling ? 'Polling Fresh Photos from Web...' : 'Poll More 4K Photos from Web'}</span>
        </button>
      </div>

    </div>
  );
};
