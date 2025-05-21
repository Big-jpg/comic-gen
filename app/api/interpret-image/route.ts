// ---- /app/api/generate-image/route.ts ----
"use server";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
    const { summary, modifier } = await req.json();

    if (!summary || summary.length < 125) {
        return NextResponse.json(
            { error: "Summary content too short for comic visualization." },
            { status: 400 }
        );
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "o4-mini",
            reasoning_effort: "medium",
            messages: [
                {
                    role: "system",
                    content:
                        `You are a visual storytelling assistant skilled at turning article summaries into visual panel descriptions for a ${modifier}-style comic strip. ` +
                        `Given a narrative summary of 2–6 sentences, convert it into a four-panel comic strip. ` +
                        `Each panel must: Reflect a key moment, scene, or concept from the article. ` +
                        `Include a short description of the panel's visuals. ` +
                        `Include a caption that summarizes the message or quote from that part of the article. ` +
                        `Use a clean, semi-realistic editorial cartoon style with a consistent character design and color palette across all panels. ` +
                        `Apply visual metaphors and exaggeration where helpful. ` +
                        `Return the output in the following format:\n` +
                        `1. Panel 1: [Visual description] (Caption: "...")\n` +
                        `2. Panel 2: [Visual description] (Caption: "...")\n` +
                        `3. Panel 3: [Visual description] (Caption: "...")\n` +
                        `4. Panel 4: [Visual description] (Caption: "...")\n` +
                        `Do not add commentary or analysis. Only produce the panel descriptions and captions.`,
                },
                {
                    role: "user",
                    content: summary,
                },
            ],
            store: false,
        });

        const script = completion.choices[0]?.message?.content?.trim() || "No comic script generated.";
        return NextResponse.json({ script });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error:", err.message);
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
    }
}
