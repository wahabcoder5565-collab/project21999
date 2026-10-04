export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
  website?: string;
  role: 'user' | 'admin';
  totalUploads: number;
  totalDownloads: number;
  totalLikes: number;
  createdAt: string;
}

export interface AIAnalysisResult {
  title: string;
  description: string;
  category: string;
  tags: string[];
  dominantColor: string;
  colorPalette: string[];
  mood: string;
  detectedObjects: string[];
  confidenceScore: number;
}

export interface Photo {
  id: string;
  title: string;
  description?: string;
  url: string;
  previewUrl: string;
  downloadUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'landscape' | 'portrait' | 'square';
  category: string;
  tags: string[];
  dominantColor: string;
  colorPalette: string[];
  views: number;
  downloads: number;
  likesCount: number;
  isLiked?: boolean;
  authorId?: string;
  status?: 'approved' | 'pending' | 'rejected';
  photographer: {
    id?: string;
    name: string;
    username: string;
    avatar: string;
    profileUrl?: string;
    bio?: string;
    location?: string;
  };
  exif?: {
    camera?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    iso?: number;
    shutterSpeed?: string;
    dimensions?: string;
  };
  aiAnalysis?: {
    mood?: string;
    detectedObjects?: string[];
    confidence?: number;
  };
  source: 'web-poller' | 'unsplash' | 'pexels' | 'user-upload';
  createdAt: string;
}

export interface Collection {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  isPrivate: boolean;
  coverImageUrl?: string;
  photoCount: number;
  photoIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  query?: string;
  category?: string;
  orientation?: 'all' | 'landscape' | 'portrait' | 'square';
  color?: string;
  sortBy?: 'trending' | 'newest' | 'popular' | 'curated';
  authorId?: string;
  status?: 'approved' | 'pending' | 'rejected' | 'all';
  page?: number;
  limit?: number;
}

export interface ReportItem {
  id: string;
  photoId: string;
  photoTitle: string;
  photoUrl: string;
  reason: string;
  reportedBy: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}
