import { NextRequest, NextResponse } from 'next/server';
import { analyzeImageWithAI } from '@/lib/ai-analyzer';

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      const text = await request.text();
      body = JSON.parse(text || '{}');
    }

    const imageUrl = body.imageUrl || body.url || '';
    const titleHint = body.titleHint || body.title || '';

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'imageUrl is required' }, { status: 400 });
    }

    const analysis = await analyzeImageWithAI(imageUrl, titleHint);

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
