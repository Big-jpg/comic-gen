// ---- /lib/openai.ts ----
import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateStripImageFromScript(script: string): Promise<string> {
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
        size: '1536x1024',
        quality: 'high',
        output_format: 'png',
        output_compression: 70,
        response_format: 'b64_json',
    });

    clearTimeout(timeout);

    const image_base64 = result.data?.[0]?.b64_json;
    if (!image_base64) {
        throw new Error('Image generation failed: Missing data in response.');
    }

    return image_base64;
}