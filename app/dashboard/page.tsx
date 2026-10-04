'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Upload, 
  Bookmark, 
  Heart, 
  Download, 
  User, 
  Settings, 
  Sparkles, 
  Plus, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  TrendingUp, 
  ArrowUpRight,
  BrainCircuit,
  Wand2,
  Lock,
  Globe,
  Camera,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Photo, Collection, AIAnalysisResult } from '@/types/photo';
import { PhotoCard } from '@/components/PhotoCard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isAdmin, updateProfile, toggleAdminRole, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'upload' | 'collections' | 'likes' | 'downloads' | 'profile'>('overview');
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [likedPhotos, setLikedPhotos] = useState<Photo[]>([]);
  
  // AI Upload form state
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Urban');
  const [uploadTags, setUploadTags] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Profile edit state
  const [editFullName, setEditFullName] = useState(profile?.fullName || '');
  const [editBio, setEditBio] = useState(profile?.bio || '');
  const [editLocation, setEditLocation] = useState(profile?.location || '');
  const [editWebsite, setEditWebsite] = useState(profile?.website || '');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditFullName(profile.fullName);
      setEditBio(profile.bio || '');
      setEditLocation(profile.location || '');
      setEditWebsite(profile.website || '');
    }
  }, [profile]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [photosRes, colRes] = await Promise.all([
          fetch('/api/photos?limit=50'),
          fetch('/api/collections')
        ]);
        const photosData = await photosRes.json();
        const colData = await colRes.json();

        if (photosData.success) {
          setUserPhotos(photosData.photos.slice(0, 6));
          setLikedPhotos(photosData.photos.filter((p: Photo) => p.likesCount > 4000));
        }
        if (colData.success) {
          setCollections(colData.collections);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };

    loadDashboardData();
  }, []);

  const handleAnalyzeWithAI = async () => {
    if (!uploadUrl) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadUrl, titleHint: uploadTitle })
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        const ai = data.analysis as AIAnalysisResult;
        setAiAnalysis(ai);
        setUploadTitle(ai.title);
        setUploadDesc(ai.description);
        setUploadCategory(ai.category);
        setUploadTags(ai.tags.join(', '));
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl) return;
    setIsUploading(true);
    try {
      const payload = {
        title: uploadTitle || 'Curated Stock Photo',
        description: uploadDesc,
        url: uploadUrl,
        category: uploadCategory,
        tags: uploadTags.split(',').map(t => t.trim()).filter(Boolean),
        photographerName: profile?.fullName || 'Alex River',
        photographerAvatar: profile?.avatarUrl,
        photographerBio: profile?.bio,
        authorId: profile?.id,
        aiAnalysis: aiAnalysis ? {
          mood: aiAnalysis.mood,
          detectedObjects: aiAnalysis.detectedObjects,
          confidence: aiAnalysis.confidenceScore
        } : undefined
      };

      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.photo) {
        setUserPhotos((prev) => [data.photo, ...prev]);
        setUploadSuccess(true);
        setUploadUrl('');
        setUploadTitle('');
        setUploadDesc('');
        setUploadTags('');
        setAiAnalysis(null);
        setTimeout(() => setUploadSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName: editFullName,
      bio: editBio,
      location: editLocation,
      website: editWebsite
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Theme Toggle */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Lumina<span className="text-cyan-600 dark:text-cyan-400">Studio</span>
              </span>
            </Link>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
            </button>
          </div>

          {/* User Profile Mini Badge */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 mb-6 flex items-center gap-3">
            <img
              src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={profile?.fullName || 'User'}
              className="w-10 h-10 rounded-full object-cover border border-cyan-500/30 shrink-0"
            />
            <div className="truncate">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{profile?.fullName || 'Creator'}</h4>
              <p className="text-[10px] text-cyan-700 dark:text-cyan-400 capitalize font-semibold">{profile?.role || 'User'} Tier</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'overview' ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'photos' ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>My Photos</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'upload' ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>AI Upload Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('collections')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'collections' ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Collections</span>
            </button>

            <button
              onClick={() => setActiveTab('likes')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'likes' ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Liked Photos</span>
            </button>

            <button
              onClick={() => setActiveTab('downloads')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'downloads' ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Downloads</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'profile' ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-2">
          {isAdmin && (
            <Link
              href="/admin"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Admin Console</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <Link
            href="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Stock Feed</span>
          </Link>
        </div>
      </aside>

      {/* Main Dashboard Panel */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-200 dark:border-white/10 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white capitalize">
              {activeTab === 'overview' ? 'Creator Overview' : activeTab === 'photos' ? 'My Photos Catalog' : activeTab === 'upload' ? 'AI-Powered Upload Studio' : activeTab}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage your stock photography, stats, downloads, and AI metadata</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('upload')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Stock Photo</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 mt-8">
            
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Uploaded Photos</span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">24</div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                  <TrendingUp className="w-3 h-3" /> +4 this week
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total Downloads</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">1,248</div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                  <TrendingUp className="w-3 h-3" /> +18.2% vs last month
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total Likes</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">382</div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                  <TrendingUp className="w-3 h-3" /> +32 new fans
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Saved Collections</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                    <Bookmark className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{collections.length}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Public & Private boards</p>
              </div>
            </div>

            {/* Recent Uploads Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Recently Uploaded</h3>
                <button onClick={() => setActiveTab('photos')} className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline">
                  View all photos
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userPhotos.slice(0, 3).map((photo) => (
                  <div key={photo.id} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                    <img src={photo.previewUrl} alt={photo.title} className="w-full h-44 object-cover" />
                    <div className="p-3.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{photo.title}</h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                        <span>{photo.views} views</span>
                        <span>{photo.downloads} downloads</span>
                        <span className="text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">Approved</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: My Photos */}
        {activeTab === 'photos' && (
          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {userPhotos.map((photo) => (
                <div key={photo.id} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                  <div className="relative">
                    <img src={photo.previewUrl} alt={photo.title} className="w-full h-48 object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 dark:bg-slate-950/80 text-[10px] font-bold text-cyan-700 dark:text-cyan-400 border border-slate-200 dark:border-white/10 shadow-xs">
                      {photo.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{photo.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{photo.width} × {photo.height} • {photo.orientation}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      <span>Downloads: <strong className="text-slate-900 dark:text-white">{photo.downloads}</strong></span>
                      <span>Likes: <strong className="text-slate-900 dark:text-white">{photo.likesCount}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Upload Studio with AI */}
        {activeTab === 'upload' && (
          <div className="mt-8 max-w-3xl">
            {uploadSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Photo published successfully to the 4K catalog & Supabase!</span>
              </div>
            )}

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-400">
                  <BrainCircuit className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>AI Auto-Tagging & Metadata Generator</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Smart AI Engine Active</span>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Direct Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={uploadUrl}
                      onChange={(e) => setUploadUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-1509198397868-..."
                      required
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleAnalyzeWithAI}
                      disabled={isAnalyzing || !uploadUrl}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      <Wand2 className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                      <span>{isAnalyzing ? 'Analyzing AI...' : 'Auto-Analyze AI'}</span>
                    </button>
                  </div>
                </div>

                {uploadUrl && (
                  <div className="rounded-xl overflow-hidden max-h-48 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                    <img src={uploadUrl} alt="Preview" className="max-h-48 object-contain" />
                  </div>
                )}

                {aiAnalysis && (
                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30 text-xs text-purple-800 dark:text-purple-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-purple-900 dark:text-purple-300">
                        <Sparkles className="w-3.5 h-3.5" /> AI Analysis Completed ({Math.round(aiAnalysis.confidenceScore * 100)}% Match)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-bold">Mood: {aiAnalysis.mood}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">Detected Elements: {aiAnalysis.detectedObjects.join(', ')}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Photo title"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Urban">Urban</option>
                      <option value="Nature">Nature</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Space">Space</option>
                      <option value="Drone">Drone</option>
                      <option value="Macro">Macro</option>
                      <option value="People">People</option>
                      <option value="Food">Food</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    value={uploadDesc}
                    onChange={(e) => setUploadDesc(e.target.value)}
                    rows={2}
                    placeholder="Describe the photograph..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={uploadTags}
                    onChange={(e) => setUploadTags(e.target.value)}
                    placeholder="Tokyo, Cyberpunk, 4K, Rain"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all active:scale-98"
                >
                  {isUploading ? 'Publishing to Stock Catalog...' : 'Publish Photo to 4K Gallery'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 4: Collections */}
        {activeTab === 'collections' && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {collections.map((col) => (
              <div key={col.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
                <div
                  className="w-full h-36 rounded-xl bg-cover bg-center border border-slate-200 dark:border-white/10"
                  style={{ backgroundImage: `url(${col.coverImageUrl})` }}
                />
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{col.title}</h4>
                    {col.isPrivate ? (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold"><Lock className="w-2.5 h-2.5" /> Private</span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold"><Globe className="w-2.5 h-2.5" /> Public</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">{col.photoCount} photos saved</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Liked Photos */}
        {activeTab === 'likes' && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {likedPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onSelectPhoto={(p) => router.push(`/photo/${p.id}`)}
                onToggleLike={() => {}}
                onAddToCollection={() => {}}
                onDownload={() => {}}
              />
            ))}
          </div>
        )}

        {/* Tab 6: Profile & Settings */}
        {activeTab === 'profile' && (
          <div className="mt-8 max-w-2xl">
            {profileSaved && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-3">Creator Profile & Settings</h3>
              
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="e.g. Vancouver, Canada"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    placeholder="Short bio for your public photographer profile..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Portfolio / Website</label>
                  <input
                    type="url"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Role Switcher */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Current Role: <span className="text-cyan-700 dark:text-cyan-400 capitalize">{profile?.role || 'user'}</span></span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Toggle between Creator (User) and Administrator</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleAdminRole}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white border border-slate-300 dark:border-white/10"
                  >
                    Switch to {profile?.role === 'admin' ? 'User' : 'Admin'}
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
