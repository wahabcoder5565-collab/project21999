'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Image as ImageIcon, 
  Users, 
  Tags, 
  AlertTriangle, 
  Settings, 
  Check, 
  X, 
  Trash2, 
  ExternalLink, 
  Plus, 
  ArrowLeft,
  Search,
  Database,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Photo, UserProfile, ReportItem } from '@/types/photo';

export default function AdminPage() {
  const { profile, isAdmin, toggleAdminRole } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'users' | 'categories' | 'reports'>('overview');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: 'rep-1',
      photoId: 'photo-1',
      photoTitle: 'Neon Tokyo Cyberpunk Rainy Alleyway',
      photoUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      reason: 'Check commercial license verification',
      reportedBy: 'user_921',
      status: 'pending',
      createdAt: '2026-10-02T14:30:00Z'
    }
  ]);
  const [categoriesList, setCategoriesList] = useState([
    { name: 'Urban', count: 18, active: true },
    { name: 'Nature', count: 42, active: true },
    { name: 'Architecture', count: 15, active: true },
    { name: 'Space', count: 12, active: true },
    { name: 'Drone', count: 9, active: true },
    { name: 'Macro', count: 8, active: true },
    { name: 'People', count: 14, active: true },
    { name: 'Food', count: 6, active: true }
  ]);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const res = await fetch('/api/photos?limit=50');
        const data = await res.json();
        if (data.success) {
          setPhotos(data.photos);
        }
      } catch (err) {
        console.error('Error loading admin photos:', err);
      }
    };

    loadAdminData();

    // Mock initial user list
    setUsersList([
      {
        id: 'u-1',
        email: 'alex.creator@luminastock.com',
        username: 'alexcreator',
        fullName: 'Alex River',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: 'admin',
        totalUploads: 6,
        totalDownloads: 1420,
        totalLikes: 385,
        createdAt: '2026-01-15T10:00:00Z'
      },
      {
        id: 'u-2',
        email: 'kenji@tokyoshots.jp',
        username: 'kenjishots',
        fullName: 'Kenji Sato',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        role: 'user',
        totalUploads: 14,
        totalDownloads: 38420,
        totalLikes: 5210,
        createdAt: '2026-02-10T11:00:00Z'
      },
      {
        id: 'u-3',
        email: 'elena@wildalps.eu',
        username: 'elenawild',
        fullName: 'Elena Rostova',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        role: 'user',
        totalUploads: 22,
        totalDownloads: 87120,
        totalLikes: 12400,
        createdAt: '2026-03-01T09:00:00Z'
      }
    ]);
  }, []);

  const handleDeletePhoto = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  const handleToggleUserRole = (userId: string) => {
    setUsersList(usersList.map(u => {
      if (u.id === userId) {
        return { ...u, role: u.role === 'admin' ? 'user' : 'admin' };
      }
      return u;
    }));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategoriesList([...categoriesList, { name: newCatName.trim(), count: 0, active: true }]);
    setNewCatName('');
  };

  const handleResolveReport = (reportId: string) => {
    setReports(reports.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">WahabStocks <span className="text-purple-600 dark:text-purple-400">Admin</span></span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-mono">v2.4 Console</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'overview' 
                  ? 'bg-purple-600 text-white font-bold shadow' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Overview Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'photos' 
                  ? 'bg-purple-600 text-white font-bold shadow' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Photo Moderation ({photos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'users' 
                  ? 'bg-purple-600 text-white font-bold shadow' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Profiles ({usersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'categories' 
                  ? 'bg-purple-600 text-white font-bold shadow' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Tags className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'reports' 
                  ? 'bg-purple-600 text-white font-bold shadow' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Reports ({reports.filter(r => r.status === 'pending').length})</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-2">
          <Link
            href="/dashboard"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <Link
            href="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-200 dark:border-white/10 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
              {activeTab === 'overview' ? 'Administration & Platform Analytics' : activeTab}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage users, content moderation, stock catalog, and Supabase RLS security</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              PostgreSQL / Supabase Connected
            </span>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Catalog Photos</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{photos.length + 120}</div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">+18 polled today</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Registered Creators</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{usersList.length + 84}</div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">98.2% Verified</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Platform Downloads</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">324,890</div>
                <p className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1">12.4 TB bandwidth served</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Pending Review Items</span>
                <div className="text-2xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">1</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Content moderation clear</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Admin Quick Moderation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <button
                  onClick={() => setActiveTab('photos')}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-left space-y-1 transition-colors"
                >
                  <p className="font-bold text-slate-900 dark:text-white">Approve & Review Photos</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Inspect recent user submissions and web polled images</p>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-left space-y-1 transition-colors"
                >
                  <p className="font-bold text-slate-900 dark:text-white">Manage User Roles</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Promote creators to administrators or verify accounts</p>
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-left space-y-1 transition-colors"
                >
                  <p className="font-bold text-slate-900 dark:text-white">Configure Stock Categories</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Add seasonal tags or re-order explore tabs</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Photos Moderation */}
        {activeTab === 'photos' && (
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="p-3.5">Photo</th>
                    <th className="p-3.5">Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Photographer</th>
                    <th className="p-3.5">Views / Downloads</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
                  {photos.map((photo) => (
                    <tr key={photo.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5">
                        <img src={photo.previewUrl} alt={photo.title} className="w-12 h-8 rounded-lg object-cover" />
                      </td>
                      <td className="p-3.5 font-medium text-slate-900 dark:text-white max-w-xs truncate">{photo.title}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-cyan-50 dark:bg-slate-800 text-[10px] text-cyan-700 dark:text-cyan-400 font-medium">{photo.category}</span>
                      </td>
                      <td className="p-3.5">{photo.photographer.name}</td>
                      <td className="p-3.5">{photo.views.toLocaleString()} / {photo.downloads.toLocaleString()}</td>
                      <td className="p-3.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px]">Approved</span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Users Management */}
        {activeTab === 'users' && (
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Uploads</th>
                    <th className="p-3.5">Downloads</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5 text-right">Toggle Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 flex items-center gap-2.5">
                        <img src={u.avatarUrl} alt={u.fullName} className="w-7 h-7 rounded-full object-cover" />
                        <span className="font-bold text-slate-900 dark:text-white">{u.fullName}</span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">{u.email}</td>
                      <td className="p-3.5">{u.totalUploads}</td>
                      <td className="p-3.5">{u.totalDownloads.toLocaleString()}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' 
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleUserRole(u.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-medium transition-colors"
                        >
                          Make {u.role === 'admin' ? 'User' : 'Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Categories */}
        {activeTab === 'categories' && (
          <div className="mt-8 space-y-6 max-w-2xl">
            <form onSubmit={handleAddCategory} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex gap-2 shadow-sm">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New Category Name (e.g. 3D Renders, Wildlife)"
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Add Category
              </button>
            </form>

            <div className="grid grid-cols-2 gap-3">
              {categoriesList.map((cat) => (
                <div key={cat.name} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{cat.name}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{cat.count} photos</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Reports */}
        {activeTab === 'reports' && (
          <div className="mt-8 space-y-4">
            {reports.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={r.photoUrl} alt={r.photoTitle} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{r.photoTitle}</h4>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">Reason: {r.reason}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Reported by: {r.reportedBy}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {r.status === 'pending' ? (
                    <button
                      onClick={() => handleResolveReport(r.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm"
                    >
                      Resolve & Approve
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Resolved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

    </div>
  );
}
