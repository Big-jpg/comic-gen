// ---- /app/api/generate-image/route.ts ----
import { NextRequest, NextResponse } from 'next/server';
import { generateSinglePanelImage } from '@/lib/openai';

export async function POST(req: NextRequest) {
    try {
        const { visual, caption, size, quality, output_format, output_compression } = await req.json();

        if (!visual || !caption) {
            return NextResponse.json({ error: 'Missing visual or caption' }, { status: 400 });
        }

        const url = await generateSinglePanelImage(
            visual,
            caption,
            size,
            quality,
            output_compression,
            output_format
        );

        return NextResponse.json({ url });
    } catch (error: unknown) {
        console.error('Image generation error:', error);
        return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }
}
