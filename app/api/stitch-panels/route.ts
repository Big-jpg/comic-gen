// ---- /app/api/stitch-panels/route.ts ----
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const { images, size } = await req.json();

        if (!Array.isArray(images) || images.length !== 4) {
            return NextResponse.json({ error: 'Exactly 4 images are required.' }, { status: 400 });
        }

        const [width, height] = size.split('x').map(Number);
        const panelBuffers = await Promise.all(
            images.map((b64: string) =>
                Buffer.from(b64, 'base64')
            )
        );

        const composite = await sharp({
            create: {
                width: width * 4,
                height,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            },
        })
            .composite(
                panelBuffers.map((buffer, i) => ({ input: buffer, left: i * width, top: 0 }))
            )
            .png()
            .toBuffer();

        const stitchedBase64 = composite.toString('base64');
        return NextResponse.json({ image: stitchedBase64 });
    } catch (error: unknown) {
        console.error('Stitching error:', error);
        return NextResponse.json({ error: 'Failed to stitch panels.' }, { status: 500 });
    }
}
