// ---- /app/api/generate-image/route.ts ----
// import { generateStripImageFromScript } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';
import { generateSinglePanelImage } from '@/lib/openai';


export async function POST(req: NextRequest) {
    try {
        const { prompt, size, quality, output_format, output_compression } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
        }

        const url = await generateSinglePanelImage(
            prompt,
            size,
            quality,
            output_compression,
            output_format
        );

        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('Image generation error:', error);
        return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }
}
