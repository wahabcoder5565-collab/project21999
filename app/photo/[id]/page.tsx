'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
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
  Layers,
  Wand2,
  ShieldCheck,
  BrainCircuit,
  Sun,
  Moon
} from 'lucide-react';
import { Photo } from '@/types/photo';
import confetti from 'canvas-confetti';
import { PhotoCard } from '@/components/PhotoCard';
import { CollectionDrawer } from '@/components/CollectionDrawer';
import { useTheme } from '@/lib/theme-context';

const FILTER_PRESETS = [
  { name: 'Original', filter: 'none' },
  { name: 'Vibrant HDR', filter: 'contrast(120%) saturate(140%)' },
  { name: 'Moody B&W', filter: 'grayscale(100%) contrast(130%)' },
  { name: 'Cyber Neon', filter: 'hue-rotate(290deg) contrast(125%) saturate(150%)' },
  { name: 'Golden Hour', filter: 'sepia(30%) saturate(130%) hue-rotate(-10deg)' },
  { name: 'Cinematic Teal', filter: 'contrast(115%) saturate(120%) hue-rotate(180deg)' },
];

export default function PhotoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const photoId = params?.id as string;
  const { theme, toggleTheme } = useTheme();

  const [photo, setPhoto] = useState<Photo | null>(null);
  const [relatedPhotos, setRelatedPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'ai' | 'filter' | 'colors'>('info');
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  useEffect(() => {
    if (!photoId) return;

    const loadPhoto = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/photos/${photoId}`);
        const data = await res.json();
        if (data.success && data.photo) {
          setPhoto(data.photo);
          
          // Load related photos
          const relRes = await fetch(`/api/photos?category=${data.photo.category}&limit=6`);
          const relData = await relRes.json();
          if (relData.success) {
            setRelatedPhotos(relData.photos.filter((p: Photo) => p.id !== data.photo.id));
          }
        }
      } catch (err) {
        console.error('Error loading photo detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhoto();
  }, [photoId]);

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

  const handleToggleLike = async () => {
    if (!photo) return;
    const newLiked = !photo.isLiked;
    setPhoto({
      ...photo,
      isLiked: newLiked,
      likesCount: newLiked ? photo.likesCount + 1 : Math.max(0, photo.likesCount - 1),
    });

    fetch('/api/photos/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId: photo.id }),
    });
  };

  const handleDownload = (resolution: string) => {
    if (!photo) return;
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#ec4899', '#10b981']
      });
    } catch (e) {}

    fetch('/api/photos/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId: photo.id, resolution }),
    });

    const downloadLink = photo.downloadUrl || photo.url;
    const a = document.createElement('a');
    a.href = downloadLink;
    a.target = '_blank';
    a.download = `${photo.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${resolution}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-600 dark:border-cyan-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading high-resolution photo data...</p>
        </div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Photo Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">The photo might have been removed or is pending review.</p>
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs"
        >
          Back to Stock Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white transition-colors duration-200">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-cyan-500 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <Link href="/" className="text-sm font-bold text-slate-900 dark:text-white hidden sm:block">
              Wahab<span className="text-pink-600 dark:text-pink-400">Stocks</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
            </button>

            <button
              onClick={handleCopyShareLink}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                photo.isLiked
                  ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/40'
                  : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${photo.isLiked ? 'fill-current text-rose-500' : ''}`} />
              <span>{photo.likesCount}</span>
            </button>

            <button
              onClick={() => setIsCollectionsOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-indigo-600 text-slate-700 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-white/10 transition-all"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Visual Column */}
          <div className="lg:col-span-8 flex flex-col items-center">
            
            <div className="relative w-full rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 sm:p-8 flex flex-col items-center justify-center min-h-[480px] shadow-sm">
              
              {/* Zoom Switch */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md rounded-xl p-1 border border-slate-200 dark:border-white/10 shadow-md">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white"
                >
                  {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>
              </div>

              {/* Filter Tag */}
              {selectedFilter !== 'none' && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
                  <Wand2 className="w-3 h-3" />
                  <span>Preset: {FILTER_PRESETS.find(f => f.filter === selectedFilter)?.name}</span>
                </div>
              )}

              {/* Photo Image */}
              <div className={`transition-all duration-300 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'}`}>
                <img
                  src={photo.downloadUrl || photo.url}
                  alt={photo.title}
                  style={{ filter: selectedFilter }}
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-slate-200 dark:border-white/10"
                />
              </div>

            </div>

            {/* Photographer Bar */}
            <div className="w-full mt-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <img
                  src={photo.photographer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={photo.photographer.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-cyan-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{photo.photographer.name}</h3>
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                        isFollowing ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                      }`}
                    >
                      {isFollowing ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">@{photo.photographer.username} • {photo.photographer.bio || 'Verified Stock Contributor'}</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Views: <strong className="text-cyan-700 dark:text-cyan-400">{photo.views.toLocaleString()}</strong></span>
                <span>Downloads: <strong className="text-cyan-700 dark:text-cyan-400">{photo.downloads.toLocaleString()}</strong></span>
              </div>
            </div>

          </div>

          {/* Right Sidebar Details */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Title & Description */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                  {photo.category} Stock
                </span>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 leading-snug">{photo.title}</h1>
                {photo.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{photo.description}</p>
                )}
              </div>

              {/* Free Download Card */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleDownload('original')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all active:scale-98 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Download 4K RAW (Free)</span>
                  </div>
                  <span className="text-[10px] text-cyan-100 font-normal">{photo.width} × {photo.height}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownload('large')}
                    className="py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-white/5"
                  >
                    1080p HD
                  </button>
                  <button
                    onClick={() => handleDownload('medium')}
                    className="py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-white/5"
                  >
                    720p Web
                  </button>
                </div>
              </div>
            </div>

            {/* Inspector Tabs */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
              
              <div className="flex items-center border-b border-slate-200 dark:border-white/10 pb-2 gap-3 text-xs">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`font-bold pb-1 relative ${activeTab === 'info' ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  EXIF Tech
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`font-bold pb-1 relative ${activeTab === 'ai' ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  AI Insights
                </button>
                <button
                  onClick={() => setActiveTab('filter')}
                  className={`font-bold pb-1 relative ${activeTab === 'filter' ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Filters
                </button>
                <button
                  onClick={() => setActiveTab('colors')}
                  className={`font-bold pb-1 relative ${activeTab === 'colors' ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Palette
                </button>
              </div>

              {/* Tab 1: EXIF */}
              {activeTab === 'info' && (
                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Camera</span>
                    <span className="font-bold text-slate-900 dark:text-white">{photo.exif?.camera || 'Sony A7R V'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Lens</span>
                    <span className="font-bold text-slate-900 dark:text-white">{photo.exif?.lens || '24-70mm f/2.8'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Aperture / ISO</span>
                    <span className="font-bold text-slate-900 dark:text-white">{photo.exif?.aperture || 'f/2.8'} • ISO {photo.exif?.iso || 100}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Resolution</span>
                    <span className="font-bold text-cyan-700 dark:text-cyan-400">{photo.width} × {photo.height}</span>
                  </div>
                </div>
              )}

              {/* Tab 2: AI Metadata */}
              {activeTab === 'ai' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/20 text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>AI Vision Confidence: <strong>96.4%</strong></span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Detected Mood:</span>
                    <span className="text-slate-900 dark:text-white font-bold">Atmospheric & Cinematic</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Detected Elements:</span>
                    <div className="flex flex-wrap gap-1">
                      {['Atmospheric Lighting', 'Fine Texture', 'High Dynamic Contrast'].map((obj) => (
                        <span key={obj} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Filters */}
              {activeTab === 'filter' && (
                <div className="grid grid-cols-2 gap-2">
                  {FILTER_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => setSelectedFilter(p.filter)}
                      className={`p-2 rounded-xl text-left border text-xs font-semibold ${
                        selectedFilter === p.filter ? 'bg-cyan-50 dark:bg-cyan-500/20 border-cyan-400 text-cyan-800 dark:text-cyan-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Tab 4: Colors */}
              {activeTab === 'colors' && (
                <div className="space-y-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Click to copy HEX:</span>
                  <div className="grid grid-cols-5 gap-2">
                    {photo.colorPalette.map((hex, i) => (
                      <button
                        key={i}
                        onClick={() => handleCopyColor(hex)}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5"
                      >
                        <div className="w-7 h-7 rounded-md" style={{ backgroundColor: hex }} />
                        <span className="text-[9px] font-mono text-slate-700 dark:text-slate-300 font-bold uppercase">
                          {copiedHex === hex ? 'Copied' : hex.slice(0, 7)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Tags */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
                Tags & Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {photo.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/?query=${encodeURIComponent(tag)}`}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 border border-slate-200 dark:border-white/5"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Related Photos Section */}
        {relatedPhotos.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Related {photo.category} Stock Photos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPhotos.map((rel) => (
                <PhotoCard
                  key={rel.id}
                  photo={rel}
                  onSelectPhoto={(p) => router.push(`/photo/${p.id}`)}
                  onToggleLike={() => {}}
                  onAddToCollection={() => {}}
                  onDownload={(p, res) => handleDownload(res)}
                />
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
