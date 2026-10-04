import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const collections = await db.getCollections();
    return NextResponse.json({ success: true, collections });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description = '', isPrivate = false } = await request.json();
    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Collection title is required' }, { status: 400 });
    }

    const newCollection = await db.createCollection(title.trim(), description.trim(), isPrivate);
    return NextResponse.json({ success: true, collection: newCollection });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
