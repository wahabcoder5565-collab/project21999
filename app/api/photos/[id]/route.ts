import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const photo = await db.getPhotoById(id);
    if (!photo) {
      return NextResponse.json({ success: false, error: 'Photo not found' }, { status: 404 });
    }

    // Increment view count asynchronously
    db.recordView(id);

    return NextResponse.json({ success: true, photo });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
