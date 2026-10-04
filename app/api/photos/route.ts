import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FilterOptions, Photo } from '@/types/photo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const orientation = (searchParams.get('orientation') as FilterOptions['orientation']) || 'all';
    const color = searchParams.get('color') || '';
    const sortBy = (searchParams.get('sortBy') as FilterOptions['sortBy']) || 'trending';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);

    const result = await db.getPhotos({
      query,
      category,
      orientation,
      color,
      sortBy,
      page,
      limit,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const photo: Photo = {
      id: `custom-${Date.now()}`,
      title: body.title || 'Untitled Stock Photo',
      description: body.description || '',
      url: body.url,
      previewUrl: body.url,
      downloadUrl: body.url,
      width: body.width || 3840,
      height: body.height || 2160,
      aspectRatio: (body.width && body.height) ? body.width / body.height : 16/9,
      orientation: body.orientation || 'landscape',
      category: body.category || 'Nature',
      tags: body.tags || ['Custom', 'Stock', 'Photo'],
      dominantColor: body.dominantColor || '#3b82f6',
      colorPalette: body.colorPalette || ['#3b82f6', '#1e293b', '#64748b'],
      views: 1,
      downloads: 0,
      likesCount: 1,
      photographer: {
        name: body.photographerName || 'Anonymous Creator',
        username: (body.photographerName || 'creator').toLowerCase().replace(/\s+/g, '_'),
        avatar: body.photographerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        bio: body.photographerBio || 'Stock contributor'
      },
      exif: body.exif || {
        camera: 'Digital Camera',
        lens: '50mm Standard',
        dimensions: '3840 x 2160'
      },
      source: 'user-upload',
      createdAt: new Date().toISOString()
    };

    const added = await db.addPhotos([photo]);
    return NextResponse.json({ success: true, photo: added[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
