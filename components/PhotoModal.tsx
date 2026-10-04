'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Heart, 
  Bookmark, 
  Camera, 
  Sliders, 
  Copy, 
  Check, 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  Sparkles,
  Info,
  ExternalLink,
  Layers,
  Wand2
} from 'lucide-react';
import { Photo } from '@/types/photo';
import confetti from 'canvas-confetti';

interface PhotoModalProps {
  photo: Photo | null;
  onClose: () => void;
  onToggleLike: (photoId: string) => void;
  onAddToCollection: (photo: Photo) => void;
  onDownload: (photo: Photo, resolution: string) => void;
  onSelectTag: (tag: string) => void;
}

const FILTER_PRESETS = [
  { name: 'Original', filter: 'none' },
  { name: 'Vibrant HDR', filter: 'contrast(120%) saturate(140%)' },
  { name: 'Moody B&W', filter: 'grayscale(100%) contrast(130%)' },
  { name: 'Cyber Neon', filter: 'hue-rotate(290deg) contrast(125%) saturate(150%)' },
  { name: 'Golden Hour', filter: 'sepia(30%) saturate(130%) hue-rotate(-10deg)' },
  { name: 'Cinematic Teal', filter: 'contrast(115%) saturate(120%) hue-rotate(180deg)' },
];

export const PhotoModal: React.FC<PhotoModalProps> = ({
  photo,
  onClose,
  onToggleLike,
  onAddToCollection,
  onDownload,
  onSelectTag,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'filter' | 'colors'>('info');

  if (!photo) return null;

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadWithConfetti = (resolution: string) => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#3b82f6', '#ec4899', '#10b981']
      });
    } catch (e) {}
    onDownload(photo, resolution);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10">
          
          {/* Photographer Profile */}
          <div className="flex items-center gap-3">
            <img
              src={photo.photographer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={photo.photographer.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/40 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                  {photo.photographer.name}
                </h4>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                    isFollowing
                      ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/10'
                  }`}
                >
                  {isFollowing ? 'Following' : '+ Follow'}
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                @{photo.photographer.username} • {photo.photographer.bio || 'Stock Contributor'}
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            
            {/* Share Link */}
            <button
              onClick={handleCopyShareLink}
              title="Copy photo link"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            {/* Like */}
            <button
              onClick={() => onToggleLike(photo.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                photo.isLiked
                  ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/40'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5'
              }`}
            >
              <Heart className={`w-4 h-4 ${photo.isLiked ? 'fill-current text-rose-500' : ''}`} />
              <span>{photo.likesCount}</span>
            </button>

            {/* Collection Bookmark */}
            <button
              onClick={() => onAddToCollection(photo)}
              title="Add to Collection"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 text-slate-700 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-white/5 transition-all"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 transition-all ml-2"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Main Visual Photo Area */}
          <div className="lg:col-span-8 bg-slate-100 dark:bg-slate-950/80 p-4 sm:p-8 flex flex-col items-center justify-center relative min-h-[360px] sm:min-h-[500px]">
            
            {/* Zoom Controls Overlay */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-1 border border-slate-200 dark:border-white/10 shadow-md">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white transition-all"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>
            </div>

            {/* Filter Badge */}
            {selectedFilter !== 'none' && (
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
                <Wand2 className="w-3 h-3" />
                <span>Filter: {FILTER_PRESETS.find(f => f.filter === selectedFilter)?.name}</span>
              </div>
            )}

            {/* Image Preview */}
            <div className={`relative transition-all duration-300 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'}`}>
              <img
                src={photo.downloadUrl || photo.url}
                alt={photo.title}
                style={{ filter: selectedFilter }}
                onClick={() => setIsZoomed(!isZoomed)}
                className="max-h-[65vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-slate-200 dark:border-white/10"
              />
            </div>

            {/* Source Attribution */}
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Source: <strong className="text-slate-700 dark:text-slate-200 capitalize">{photo.source}</strong></span>
              <span>•</span>
              <span>License: <strong className="text-cyan-700 dark:text-cyan-400">Free Commercial</strong></span>
            </div>

          </div>

          {/* Right Inspector & Download Panel */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/10 flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-6">
              
              {/* Photo Title & Description */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">{photo.title}</h3>
                {photo.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{photo.description}</p>
                )}
              </div>

              {/* Download Buttons Section */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Free Instant Download
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-500/20">
                    No Sign-up Req.
                  </span>
                </div>

                <button
                  onClick={() => handleDownloadWithConfetti('original')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all active:scale-98"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Download Original (4K RAW)</span>
                  </div>
                  <span className="text-[10px] text-cyan-100 font-normal">{photo.width} × {photo.height}</span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleDownloadWithConfetti('large')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-300/60 dark:border-white/5 transition-all"
                  >
                    <span>Large (1080p)</span>
                  </button>
                  <button
                    onClick={() => handleDownloadWithConfetti('medium')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-300/60 dark:border-white/5 transition-all"
                  >
                    <span>Medium (720p)</span>
                  </button>
                </div>
              </div>

              {/* Inspector Tabs */}
              <div className="flex items-center border-b border-slate-200 dark:border-white/10 pb-2 gap-4">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`text-xs font-bold pb-1 relative transition-colors ${
                    activeTab === 'info' ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Camera Specs
                  {activeTab === 'info' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full" />}
                </button>

                <button
                  onClick={() => setActiveTab('filter')}
                  className={`text-xs font-bold pb-1 relative transition-colors ${
                    activeTab === 'filter' ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Filter Studio
                  {activeTab === 'filter' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full" />}
                </button>

                <button
                  onClick={() => setActiveTab('colors')}
                  className={`text-xs font-bold pb-1 relative transition-colors ${
                    activeTab === 'colors' ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Color Palette
                  {activeTab === 'colors' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full" />}
                </button>
              </div>

              {/* Tab 1: EXIF Camera Specs */}
              {activeTab === 'info' && (
                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Camera</span>
                    <span className="font-bold text-slate-900 dark:text-white">{photo.exif?.camera || 'Sony A7R V'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Lens</span>
                    <span className="font-bold text-slate-900 dark:text-white">{photo.exif?.lens || '24-70mm f/2.8'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Focal Length</span>
                    <span className="font-bold text-slate-900 dark:text-white">{photo.exif?.focalLength || '35mm'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Aperture</span>
                    <span className="font-bold text-slate-900 dark:text-white">{photo.exif?.aperture || 'f/2.8'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">ISO</span>
                    <span className="font-bold text-slate-900 dark:text-white">{photo.exif?.iso || 100}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Views / Downloads</span>
                    <span className="font-bold text-cyan-700 dark:text-cyan-400">{photo.views.toLocaleString()} / {photo.downloads.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Filter Presets Studio */}
              {activeTab === 'filter' && (
                <div className="grid grid-cols-2 gap-2">
                  {FILTER_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setSelectedFilter(preset.filter)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        selectedFilter === preset.filter
                          ? 'bg-cyan-50 dark:bg-cyan-500/20 border-cyan-400 text-cyan-800 dark:text-cyan-300 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-white/5 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <p className="text-xs font-bold">{preset.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Live shader</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Tab 3: Color Palette with Hex Copy */}
              {activeTab === 'colors' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Click any swatch to copy HEX code:</p>
                  <div className="grid grid-cols-5 gap-2">
                    {photo.colorPalette.map((hex, i) => (
                      <button
                        key={i}
                        onClick={() => handleCopyColor(hex)}
                        className="group flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 hover:border-slate-300 transition-all"
                      >
                        <div
                          className="w-8 h-8 rounded-lg shadow-inner flex items-center justify-center"
                          style={{ backgroundColor: hex }}
                        >
                          {copiedHex === hex && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold uppercase">
                          {copiedHex === hex ? 'Copied' : hex.slice(0, 7)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags Cloud */}
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  Related Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {photo.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        onClose();
                        onSelectTag(tag);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 border border-slate-200 dark:border-white/5 transition-all font-medium"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
