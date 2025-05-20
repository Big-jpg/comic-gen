// /app/api/generate-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/openai';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
        }

        const url = await generateImage(prompt);
        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('Image generation error:', error);
        return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }
}
