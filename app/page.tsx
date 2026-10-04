'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Photo, Collection, FilterOptions } from '@/types/photo';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { FilterBar } from '@/components/FilterBar';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PhotoModal } from '@/components/PhotoModal';
import { CollectionDrawer } from '@/components/CollectionDrawer';
import { UploadModal } from '@/components/UploadModal';
import { SupabaseModal } from '@/components/SupabaseModal';
import { AuthModal } from '@/components/AuthModal';
import { LivePollerWidget } from '@/components/LivePollerWidget';

export default function Home() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [orientation, setOrientation] = useState<FilterOptions['orientation']>('all');
  const [color, setColor] = useState('');
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('trending');
  const [totalPhotos, setTotalPhotos] = useState(0);

  // Modals & Drawers state
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'signin' | 'signup'>('signin');
  const [activePhotoForCollection, setActivePhotoForCollection] = useState<Photo | null>(null);

  // 1. Fetch photos from API
  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('query', searchQuery);
      if (category) params.set('category', category);
      if (orientation && orientation !== 'all') params.set('orientation', orientation);
      if (color) params.set('color', color);
      if (sortBy) params.set('sortBy', sortBy);

      const res = await fetch(`/api/photos?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPhotos(data.photos);
        setTotalPhotos(data.total);
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, category, orientation, color, sortBy]);

  // 2. Fetch collections from API
  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections');
      const data = await res.json();
      if (data.success) {
        setCollections(data.collections);
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchCollections();
  }, [fetchPhotos]);

  // 3. Poll Fresh Photos from Web
  const handlePollWeb = async () => {
    setIsPolling(true);
    try {
      const res = await fetch('/api/photos/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: category || searchQuery || '4K Wallpaper', limit: 6 })
      });
      const data = await res.json();
      if (data.success && data.photos) {
        setPhotos((prev) => [...data.photos, ...prev]);
        setTotalPhotos((prev) => prev + data.photos.length);
      }
    } catch (err) {
      console.error('Web poll error:', err);
    } finally {
      setIsPolling(false);
    }
  };

  // 4. Like / Unlike Photo
  const handleToggleLike = async (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          const newLiked = !p.isLiked;
          return {
            ...p,
            isLiked: newLiked,
            likesCount: newLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );

    if (selectedPhoto && selectedPhoto.id === photoId) {
      const newLiked = !selectedPhoto.isLiked;
      setSelectedPhoto({
        ...selectedPhoto,
        isLiked: newLiked,
        likesCount: newLiked ? selectedPhoto.likesCount + 1 : Math.max(0, selectedPhoto.likesCount - 1),
      });
    }

    try {
      await fetch('/api/photos/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId }),
      });
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // 5. Download Photo
  const handleDownload = async (photo: Photo, resolution: string) => {
    try {
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
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  // 6. Collections actions
  const handleCreateCollection = async (title: string, description: string, isPrivate: boolean) => {
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, isPrivate }),
      });
      const data = await res.json();
      if (data.success && data.collection) {
        setCollections((prev) => [data.collection, ...prev]);
        if (activePhotoForCollection) {
          handleTogglePhotoInCollection(data.collection.id, activePhotoForCollection.id);
        }
      }
    } catch (err) {
      console.error('Create collection error:', err);
    }
  };

  const handleTogglePhotoInCollection = async (collectionId: string, photoId: string) => {
    try {
      const res = await fetch('/api/collections/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId, photoId }),
      });
      const data = await res.json();
      if (data.success && data.collection) {
        setCollections((prev) =>
          prev.map((c) => (c.id === collectionId ? data.collection : c))
        );
      }
    } catch (err) {
      console.error('Toggle photo in collection error:', err);
    }
  };

  const handleSelectCollectionPhotos = (photoIds: string[], title: string) => {
    const filtered = photos.filter((p) => photoIds.includes(p.id));
    if (filtered.length > 0) {
      setPhotos(filtered);
      setTotalPhotos(filtered.length);
      setSearchQuery(title);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-cyan-500 selection:text-white transition-colors duration-200">
      
      {/* 1. Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenCollections={() => {
          setActivePhotoForCollection(null);
          setIsCollectionsOpen(true);
        }}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        onOpenAuth={(tab) => {
          setAuthDefaultTab(tab || 'signin');
          setIsAuthOpen(true);
        }}
        onPollLive={handlePollWeb}
        isPolling={isPolling}
        collectionsCount={collections.length}
      />

      {/* 2. Hero Section */}
      <HeroBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectTag={(tag) => setSearchQuery(tag)}
      />

      {/* 3. Sticky Category & Filter Controls Bar */}
      <FilterBar
        category={category}
        onCategoryChange={setCategory}
        orientation={orientation}
        onOrientationChange={setOrientation}
        color={color}
        onColorChange={setColor}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalCount={totalPhotos}
      />

      {/* 4. Photo Masonry Grid */}
      <main className="flex-1">
        <PhotoGrid
          photos={photos}
          isLoading={isLoading}
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
          onToggleLike={handleToggleLike}
          onAddToCollection={(photo) => {
            setActivePhotoForCollection(photo);
            setIsCollectionsOpen(true);
          }}
          onDownload={handleDownload}
          onPollMore={handlePollWeb}
          isPolling={isPolling}
        />
      </main>

      {/* 5. Modals & Drawers */}
      <PhotoModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onToggleLike={handleToggleLike}
        onAddToCollection={(photo) => {
          setActivePhotoForCollection(photo);
          setIsCollectionsOpen(true);
        }}
        onDownload={handleDownload}
        onSelectTag={(tag) => {
          setSearchQuery(tag);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />

      <CollectionDrawer
        isOpen={isCollectionsOpen}
        onClose={() => {
          setIsCollectionsOpen(false);
          setActivePhotoForCollection(null);
        }}
        collections={collections}
        onCreateCollection={handleCreateCollection}
        onTogglePhotoInCollection={handleTogglePhotoInCollection}
        activePhotoForCollection={activePhotoForCollection}
        onSelectCollectionPhotos={handleSelectCollectionPhotos}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onPhotoUploaded={(newPhoto) => {
          setPhotos((prev) => [newPhoto, ...prev]);
          setTotalPhotos((prev) => prev + 1);
        }}
      />

      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab={authDefaultTab}
      />

      {/* 6. Live Web Polling Stream Widget */}
      <LivePollerWidget
        onPoll={handlePollWeb}
        isPolling={isPolling}
      />

    </div>
  );
}
