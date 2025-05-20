// ---- /lib/openai.ts ----
import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateStripImageFromScript(
    script: string,
    size: '1024x1024' | '1024x1536' | '1536x1024' = '1024x1024',
    quality: 'low' | 'medium' | 'high' | 'auto' = 'high',
    compression: number = 50,
    output_format: 'jpeg' | 'png' = 'jpeg'
): Promise<string> {
    const prompt = `
Create a clean, semi-realistic editorial cartoon with four distinct panels in a horizontal strip. Each panel visualizes a moment from the summary below, using consistent characters and color schemes.

Style: Consistent line art, semi-realistic but expressive, slightly exaggerated expressions for emphasis. Clean layout. Use labeled signs, props, and character expressions to communicate each caption clearly.

Narrative:
${script}

Instructions:
- Arrange panels left to right.
- Ensure character continuity (e.g. same couple throughout).
- Use clean typography for captions.
- Do not add speech bubbles unless specified.
`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const result = await openai.images.generate({
        model: 'gpt-image-1',
        prompt,
        size,
        quality,
        output_compression: compression,
        output_format,
    });

    clearTimeout(timeout);

    const image_base64 = result.data?.[0]?.b64_json;
    if (!image_base64) {
        throw new Error('Image generation failed: Missing data in response.');
    }

    return image_base64;
}
