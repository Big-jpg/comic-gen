// ---- /lib/openai.ts ----
import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateImage(prompt: string) {
    const image = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
    });
    if (!image.data || image.data.length === 0) {
        throw new Error('No image data returned from OpenAI');
    }
    return image.data[0].url;
}