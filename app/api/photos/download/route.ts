import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { photoId, resolution = 'original' } = await request.json();
    if (!photoId) {
      return NextResponse.json({ success: false, error: 'Photo ID is required' }, { status: 400 });
    }

    const downloadCount = await db.recordDownload(photoId, resolution);
    return NextResponse.json({ success: true, downloadCount });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
