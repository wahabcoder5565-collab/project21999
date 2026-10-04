import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { collectionId, photoId } = await request.json();
    if (!collectionId || !photoId) {
      return NextResponse.json({ success: false, error: 'collectionId and photoId are required' }, { status: 400 });
    }

    const updated = await db.togglePhotoInCollection(collectionId, photoId);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, collection: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
