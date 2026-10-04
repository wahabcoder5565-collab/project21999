import { Photo, Collection, FilterOptions } from '@/types/photo';
import { INITIAL_PHOTOS, INITIAL_COLLECTIONS } from '@/lib/mock-photos';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { performSmartSearch } from '@/lib/smart-search';

// In-memory backend storage for fallback
let photosMemoryStore: Photo[] = [...INITIAL_PHOTOS];
let collectionsMemoryStore: Collection[] = [...INITIAL_COLLECTIONS];
const likesSet = new Set<string>();

export const db = {
  // 1. Fetch Photos with filtering, search, sorting
  async getPhotos(options: FilterOptions = {}): Promise<{ photos: Photo[]; total: number }> {
    const { query = '', category = '', orientation = 'all', color = '', sortBy = 'trending', page = 1, limit = 20 } = options;

    if (isSupabaseConfigured && supabase) {
      try {
        let req = supabase.from('photos').select('*', { count: 'exact' });

        if (query) {
          req = req.or(`title.ilike.%${query}%,category.ilike.%${query}%`);
        }
        if (category && category !== 'All') {
          req = req.ilike('category', `%${category}%`);
        }
        if (orientation && orientation !== 'all') {
          req = req.eq('orientation', orientation);
        }

        if (sortBy === 'trending') {
          req = req.order('likes_count', { ascending: false });
        } else if (sortBy === 'popular') {
          req = req.order('downloads', { ascending: false });
        } else if (sortBy === 'newest') {
          req = req.order('created_at', { ascending: false });
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error, count } = await req.range(from, to);

        if (!error && data && data.length > 0) {
          const mappedPhotos: Photo[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            url: item.url,
            previewUrl: item.preview_url || item.url,
            downloadUrl: item.download_url || item.url,
            width: item.width,
            height: item.height,
            aspectRatio: Number(item.aspect_ratio) || 1.5,
            orientation: item.orientation,
            category: item.category,
            tags: item.tags || [],
            dominantColor: item.dominant_color || '#3b82f6',
            colorPalette: item.color_palette || [],
            views: item.views || 0,
            downloads: item.downloads || 0,
            likesCount: item.likes_count || 0,
            isLiked: likesSet.has(item.id),
            photographer: item.photographer || { name: 'Anonymous', username: 'photographer', avatar: '' },
            exif: item.exif || {},
            source: item.source || 'unsplash',
            createdAt: item.created_at
          }));
          return { photos: mappedPhotos, total: count || mappedPhotos.length };
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using local memory store:', err);
      }
    }

    // Local / Memory filtering fallback
    let results = [...photosMemoryStore];

    if (query.trim()) {
      results = performSmartSearch(results, query);
    }

    if (category && category !== 'All') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (orientation && orientation !== 'all') {
      results = results.filter(p => p.orientation === orientation);
    }

    if (color) {
      results = results.filter(p => 
        p.dominantColor.toLowerCase().includes(color.toLowerCase()) ||
        p.colorPalette.some(c => c.toLowerCase().includes(color.toLowerCase()))
      );
    }

    // Sorting
    if (sortBy === 'trending') {
      results.sort((a, b) => b.likesCount + b.views * 0.1 - (a.likesCount + a.views * 0.1));
    } else if (sortBy === 'popular') {
      results.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = results.length;
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit).map(p => ({
      ...p,
      isLiked: likesSet.has(p.id)
    }));

    return { photos: paginated, total };
  },

  // 2. Get Single Photo
  async getPhotoById(id: string): Promise<Photo | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('photos').select('*').eq('id', id).single();
        if (!error && data) {
          return {
            id: data.id,
            title: data.title,
            description: data.description,
            url: data.url,
            previewUrl: data.preview_url || data.url,
            downloadUrl: data.download_url || data.url,
            width: data.width,
            height: data.height,
            aspectRatio: Number(data.aspect_ratio) || 1.5,
            orientation: data.orientation,
            category: data.category,
            tags: data.tags || [],
            dominantColor: data.dominant_color,
            colorPalette: data.color_palette || [],
            views: data.views || 0,
            downloads: data.downloads || 0,
            likesCount: data.likes_count || 0,
            isLiked: likesSet.has(data.id),
            photographer: data.photographer,
            exif: data.exif,
            source: data.source,
            createdAt: data.created_at
          };
        }
      } catch (err) {
        console.warn('Supabase single fetch error:', err);
      }
    }

    const found = photosMemoryStore.find(p => p.id === id);
    if (found) {
      return { ...found, isLiked: likesSet.has(found.id) };
    }
    return null;
  },

  // 3. Add Photos (from Web Poller or Upload)
  async addPhotos(newPhotos: Photo[]): Promise<Photo[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const payload = newPhotos.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          url: p.url,
          preview_url: p.previewUrl,
          download_url: p.downloadUrl,
          width: p.width,
          height: p.height,
          aspect_ratio: p.aspectRatio,
          orientation: p.orientation,
          category: p.category,
          tags: p.tags,
          dominant_color: p.dominantColor,
          color_palette: p.colorPalette,
          views: p.views,
          downloads: p.downloads,
          likes_count: p.likesCount,
          photographer: p.photographer,
          exif: p.exif,
          source: p.source,
          created_at: p.createdAt
        }));
        await supabase.from('photos').upsert(payload, { onConflict: 'id' });
      } catch (err) {
        console.warn('Supabase upsert error:', err);
      }
    }

    // Add to memory store at top if not existing
    for (const photo of newPhotos) {
      const existingIdx = photosMemoryStore.findIndex(p => p.id === photo.id);
      if (existingIdx >= 0) {
        photosMemoryStore[existingIdx] = photo;
      } else {
        photosMemoryStore.unshift(photo);
      }
    }

    return newPhotos;
  },

  // 4. Like / Unlike Photo
  async toggleLike(photoId: string): Promise<{ liked: boolean; likesCount: number }> {
    const isCurrentlyLiked = likesSet.has(photoId);
    let newLikedState = !isCurrentlyLiked;
    
    if (newLikedState) {
      likesSet.add(photoId);
    } else {
      likesSet.delete(photoId);
    }

    const photo = photosMemoryStore.find(p => p.id === photoId);
    let currentLikes = photo ? photo.likesCount : 100;
    let newLikesCount = newLikedState ? currentLikes + 1 : Math.max(0, currentLikes - 1);

    if (photo) {
      photo.likesCount = newLikesCount;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = supabase;
        if (newLikedState) {
          await client.from('likes').insert({ photo_id: photoId, user_identifier: 'anon-user' });
          await client.from('photos').update({ likes_count: newLikesCount }).eq('id', photoId);
        } else {
          await client.from('likes').delete().match({ photo_id: photoId, user_identifier: 'anon-user' });
          await client.from('photos').update({ likes_count: newLikesCount }).eq('id', photoId);
        }
      } catch (err) {
        console.warn('Supabase like error:', err);
      }
    }

    return { liked: newLikedState, likesCount: newLikesCount };
  },

  // 5. Increment Download Count
  async recordDownload(photoId: string, resolution: string = 'original'): Promise<number> {
    const photo = photosMemoryStore.find(p => p.id === photoId);
    let count = (photo?.downloads || 0) + 1;
    if (photo) {
      photo.downloads = count;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('downloads').insert({ photo_id: photoId, resolution });
        await supabase.from('photos').update({ downloads: count }).eq('id', photoId);
      } catch (err) {
        console.warn('Supabase download logging error:', err);
      }
    }

    return count;
  },

  // 6. Increment View Count
  async recordView(photoId: string): Promise<void> {
    const photo = photosMemoryStore.find(p => p.id === photoId);
    if (photo) {
      photo.views += 1;
    }
    if (isSupabaseConfigured && supabase) {
      try {
        if (photo) {
          await supabase.from('photos').update({ views: photo.views }).eq('id', photoId);
        }
      } catch (err) {
        // quiet catch
      }
    }
  },

  // 7. Collections Management
  async getCollections(): Promise<Collection[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            isPrivate: c.is_private,
            coverImageUrl: c.cover_image_url,
            photoCount: c.photo_count || (c.photo_ids?.length || 0),
            photoIds: c.photo_ids || [],
            createdAt: c.created_at,
            updatedAt: c.updated_at
          }));
        }
      } catch (err) {
        console.warn('Supabase collections error:', err);
      }
    }

    return collectionsMemoryStore;
  },

  async createCollection(title: string, description: string = '', isPrivate: boolean = false): Promise<Collection> {
    const newCollection: Collection = {
      id: `col-${Date.now()}`,
      title,
      description,
      isPrivate,
      coverImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      photoCount: 0,
      photoIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    collectionsMemoryStore.unshift(newCollection);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('collections').insert({
          id: newCollection.id,
          title: newCollection.title,
          description: newCollection.description,
          is_private: newCollection.isPrivate,
          cover_image_url: newCollection.coverImageUrl,
          photo_count: 0,
          photo_ids: []
        });
      } catch (err) {
        console.warn('Supabase create collection error:', err);
      }
    }

    return newCollection;
  },

  async togglePhotoInCollection(collectionId: string, photoId: string): Promise<Collection | null> {
    const col = collectionsMemoryStore.find(c => c.id === collectionId);
    if (!col) return null;

    const exists = col.photoIds.includes(photoId);
    if (exists) {
      col.photoIds = col.photoIds.filter(id => id !== photoId);
    } else {
      col.photoIds.push(photoId);
      // update cover image if first photo
      const photo = photosMemoryStore.find(p => p.id === photoId);
      if (photo) {
        col.coverImageUrl = photo.previewUrl;
      }
    }
    col.photoCount = col.photoIds.length;
    col.updatedAt = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('collections').update({
          photo_ids: col.photoIds,
          photo_count: col.photoCount,
          cover_image_url: col.coverImageUrl,
          updated_at: col.updatedAt
        }).eq('id', collectionId);
      } catch (err) {
        console.warn('Supabase toggle photo error:', err);
      }
    }

    return col;
  }
};
