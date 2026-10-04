'use client';

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Folder, 
  Lock, 
  Globe, 
  Trash2, 
  Check, 
  Sparkles,
  BookmarkPlus
} from 'lucide-react';
import { Collection, Photo } from '@/types/photo';

interface CollectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  onCreateCollection: (title: string, description: string, isPrivate: boolean) => void;
  onTogglePhotoInCollection: (collectionId: string, photoId: string) => void;
  activePhotoForCollection: Photo | null;
  onSelectCollectionPhotos: (photoIds: string[], title: string) => void;
}

export const CollectionDrawer: React.FC<CollectionDrawerProps> = ({
  isOpen,
  onClose,
  collections,
  onCreateCollection,
  onTogglePhotoInCollection,
  activePhotoForCollection,
  onSelectCollectionPhotos,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateCollection(newTitle, newDesc, isPrivate);
    setNewTitle('');
    setNewDesc('');
    setShowCreateForm(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
      >
        
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Your Collections</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {activePhotoForCollection && (
            <div className="my-4 p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 flex items-center gap-3">
              <img
                src={activePhotoForCollection.previewUrl}
                alt={activePhotoForCollection.title}
                className="w-12 h-12 rounded-lg object-cover border border-cyan-300 dark:border-cyan-500/40"
              />
              <div className="truncate">
                <p className="text-xs text-cyan-800 dark:text-cyan-300 font-bold">Select Collection to Save:</p>
                <p className="text-xs text-slate-700 dark:text-white truncate">{activePhotoForCollection.title}</p>
              </div>
            </div>
          )}

          {/* Create Collection Button or Form */}
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full my-4 py-2.5 px-4 rounded-xl border border-dashed border-cyan-400/60 dark:border-cyan-500/40 hover:border-cyan-600 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Board / Collection</span>
            </button>
          ) : (
            <form onSubmit={handleCreate} className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">New Collection</h4>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Collection Title (e.g. Neon Cyberpunk)"
                required
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-white/10 text-cyan-600"
                  />
                  <span>Private collection</span>
                </label>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-sm"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-xs hover:bg-slate-300 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Collection Items List */}
          <div className="space-y-2.5 mt-4">
            {collections.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-8">No collections created yet.</p>
            ) : (
              collections.map((col) => {
                const isPhotoInCol = activePhotoForCollection
                  ? col.photoIds?.includes(activePhotoForCollection.id)
                  : false;

                return (
                  <div
                    key={col.id}
                    className="group flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/5 hover:border-cyan-500/40 transition-all cursor-pointer shadow-xs"
                    onClick={() => {
                      if (activePhotoForCollection) {
                        onTogglePhotoInCollection(col.id, activePhotoForCollection.id);
                      } else {
                        onSelectCollectionPhotos(col.photoIds || [], col.title);
                        onClose();
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 bg-cover bg-center border border-slate-200 dark:border-white/10 shrink-0"
                        style={{
                          backgroundImage: col.coverImageUrl ? `url(${col.coverImageUrl})` : undefined,
                        }}
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                          {col.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                          <span>{col.photoCount || col.photoIds?.length || 0} photos</span>
                          <span>•</span>
                          {col.isPrivate ? (
                            <span className="flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400"><Lock className="w-2.5 h-2.5" /> Private</span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400"><Globe className="w-2.5 h-2.5" /> Public</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {activePhotoForCollection && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePhotoInCollection(col.id, activePhotoForCollection.id);
                        }}
                        className={`p-2 rounded-xl border transition-all ${
                          isPhotoInCol
                            ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold border-emerald-500'
                            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {isPhotoInCol ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400">
          Collections are saved to your active backend & Supabase store.
        </div>

      </div>
    </div>
  );
};
