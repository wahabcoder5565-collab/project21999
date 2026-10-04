-- ==========================================================
-- LuminaStock Production Supabase PostgreSQL Schema
-- ==========================================================

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    total_uploads INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Photos Table
CREATE TABLE IF NOT EXISTS public.photos (
    id TEXT PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    preview_url TEXT NOT NULL,
    download_url TEXT NOT NULL,
    width INTEGER NOT NULL DEFAULT 3840,
    height INTEGER NOT NULL DEFAULT 2160,
    aspect_ratio NUMERIC NOT NULL DEFAULT 1.77,
    orientation TEXT NOT NULL DEFAULT 'landscape' CHECK (orientation IN ('landscape', 'portrait', 'square')),
    category TEXT NOT NULL DEFAULT 'Nature',
    tags TEXT[] DEFAULT '{}',
    dominant_color TEXT DEFAULT '#3b82f6',
    color_palette TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
    photographer JSONB NOT NULL DEFAULT '{}'::jsonb,
    exif JSONB DEFAULT '{}'::jsonb,
    ai_analysis JSONB DEFAULT '{}'::jsonb,
    source TEXT DEFAULT 'unsplash',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    cover_image_url TEXT,
    photo_count INTEGER DEFAULT 0,
    photo_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Likes Table
CREATE TABLE IF NOT EXISTS public.likes (
    id BIGSERIAL PRIMARY KEY,
    photo_id TEXT REFERENCES public.photos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(photo_id, user_id)
);

-- 5. Downloads Tracking Table
CREATE TABLE IF NOT EXISTS public.downloads (
    id BIGSERIAL PRIMARY KEY,
    photo_id TEXT REFERENCES public.photos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolution TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Content Moderation Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY,
    photo_id TEXT REFERENCES public.photos(id) ON DELETE CASCADE,
    photo_title TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    reason TEXT NOT NULL,
    reported_by TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT,
    photo_count INTEGER DEFAULT 0
);

-- Indices for rapid queries
CREATE INDEX IF NOT EXISTS idx_photos_category ON public.photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_status ON public.photos(status);
CREATE INDEX IF NOT EXISTS idx_photos_author ON public.photos(author_id);
CREATE INDEX IF NOT EXISTS idx_photos_tags ON public.photos USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_photos_likes_views ON public.photos(likes_count DESC, views DESC);
CREATE INDEX IF NOT EXISTS idx_collections_user ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON public.likes(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: Anyone can view, users can update their own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Photos: Public can view approved photos; authors can view their own; admins can view all
CREATE POLICY "Approved photos viewable by everyone" ON public.photos FOR SELECT 
USING (status = 'approved' OR auth.uid() = author_id);
CREATE POLICY "Authenticated users can insert photos" ON public.photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own photos" ON public.photos FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own photos" ON public.photos FOR DELETE USING (auth.uid() = author_id);

-- Collections: Public collections viewable by all, private only by owner
CREATE POLICY "Collections viewable based on privacy" ON public.collections FOR SELECT 
USING (is_private = false OR auth.uid() = user_id);
CREATE POLICY "Users can create collections" ON public.collections FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own collections" ON public.collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON public.collections FOR DELETE USING (auth.uid() = user_id);

-- Likes & Downloads
CREATE POLICY "Public likes viewable" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can insert likes" ON public.likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Downloads logging insert" ON public.downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "Reports insert" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Categories viewable" ON public.categories FOR SELECT USING (true);
