import { NextRequest, NextResponse } from 'next/server';
import { pollPhotosFromWeb } from '@/lib/web-poller';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const query = body.query || '';
    const limit = body.limit || 6;

    // Fetch fresh dynamic photos from curated web image feeds
    const polledPhotos = await pollPhotosFromWeb(query, limit);

    // Save to Supabase / store
    await db.addPhotos(polledPhotos);

    return NextResponse.json({
      success: true,
      count: polledPhotos.length,
      photos: polledPhotos,
      message: `Polled ${polledPhotos.length} high-res stock photos from web feeds for "${query || 'Curated Feed'}"`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
