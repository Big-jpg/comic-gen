// ---- /components/StoryPanel.tsx ----
'use client';
import { useState } from 'react';
import PanelEditor from './PanelEditor';
import PanelLayout from './PanelLayout';

interface Props {
    modifiers: string[];
}

const SIZES = {
    square: '1024x1024',
    portrait: '1024x1792',
    landscape: '1792x1024',
} as const;

type SizeKey = keyof typeof SIZES;
type Quality = 'low' | 'medium' | 'high' | 'auto';
type Format = 'jpeg' | 'png';

type Panel = {
    visual: string;
    caption: string;
    image?: string;
    accepted: boolean;
};

export default function StoryPanel({ modifiers }: Props) {
    const [prompt, setPrompt] = useState('');
    // Modifier is now user-selectable
    const [modifier, setModifier] = useState(modifiers[0]);
    // The rest are constants for now
    const size: SizeKey = 'square';
    const quality: Quality = 'high';
    const format: Format = 'jpeg';
    const compression: number = 50;

    const [loading, setLoading] = useState(false);
    const [panels, setPanels] = useState<Panel[]>([]);
    const [finalStrip, setFinalStrip] = useState<string | null>(null);

    async function interpret(initialPrompt: string, context: string[] = []) {
        setLoading(true);

        const res = await fetch('/api/interpret-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ summary: initialPrompt, modifier, context }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('Interpretation error:', err);
            setLoading(false);
            return;
        }

        const { script } = await res.json();
        const parsed = parsePanels(script);

        if (parsed.length > 0) {
            setPanels(prev => [...prev, parsed[0]]);
        }

        setLoading(false);
    }

    function parsePanels(script: string): Panel[] {
        const lines = script.split(/\r?\n/).filter(Boolean);
        const panels: Panel[] = [];

        for (const line of lines) {
            const trimmed = line.trim();
            const match = /^(\d+\.\s*)?Panel\s*\d+:\s*(.*?)(?:\s*\(Caption:\s*["“](.*?)["”]\))?$/i.exec(trimmed);

            if (match) {
                const visual = match[2].trim();           // <-- use const
                let caption = match[3]?.trim() || '';     // <-- keep let

                if (caption.split(/\s+/).length > 20) {
                    caption = caption.split(/\s+/).slice(0, 20).join(' ') + '…';
                }

                panels.push({ visual, caption, accepted: false });
            } else {
                panels.push({ visual: trimmed, caption: '', accepted: false });
            }


            if (panels.length >= 1) break;
        }

        return panels;
    }

    function handleAccept(index: number, image: string) {
        setPanels((prev) => {
            const updated = prev.map((p, i) => (i === index ? { ...p, image, accepted: true } : p));

            if (index === prev.length - 1 && updated.length < 4) {
                const context = updated
                    .filter(p => p.accepted)
                    .map(p => `${p.visual} (Caption: \"${p.caption}\")`);
                interpret(prompt, context);
            }

            return updated;
        });
    }

    async function stitchPanels() {
        const images = panels.map((p) => p.image).filter(Boolean);
        if (images.length !== 4) return;

        const res = await fetch('/api/stitch-panels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images, size: SIZES[size] }),
        });

        const { image } = await res.json();
        setFinalStrip(image);
    }

    function downloadImage() {
        if (!finalStrip) return;
        const a = document.createElement('a');
        a.href = `data:image/png;base64,${finalStrip}`;
        a.download = 'comic-strip.png';
        a.click();
    }

    function resetAll() {
        setPrompt('');
        setPanels([]);
        setFinalStrip(null);
        setLoading(false);
    }

    return (
        <div className="space-y-4">
            <label className="block font-medium">Scene Prompt</label>
            <textarea
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Enter narrative summary (2–6 sentences)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />

            {/* Modifier dropdown */}
            <label className="block font-medium mt-4">Visual Style</label>
            <select
                className="w-full p-2 border rounded"
                value={modifier}
                onChange={e => setModifier(e.target.value)}
            >
                {modifiers.map((m) => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>

            <button
                onClick={() => interpret(prompt)}
                disabled={loading || panels.length > 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition-colors"
            >
                {loading ? 'Processing...' : 'Start with Panel 1'}
            </button>

            <button
                onClick={resetAll}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full transition-colors"
            >
                Reset All
            </button>

            {panels.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Panel Editors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {panels.map((panel, idx) => (
                            <PanelEditor
                                key={idx}
                                index={idx}
                                visual={panel.visual}
                                caption={panel.caption}
                                size={SIZES[size]}
                                quality={quality}
                                output_format={format}
                                output_compression={compression}
                                onAccept={handleAccept}
                                context={panels
                                    .slice(0, idx)
                                    .filter(p => p.accepted)
                                    .map(p => `${p.visual} (Caption: \"${p.caption}\")`)}
                            />
                        ))}
                    </div>

                    {panels.every(p => p.accepted) && panels.length === 4 && (
                        <>
                            <PanelLayout panels={panels.map(p => p.image!)} />
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={stitchPanels}
                                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
                                >
                                    Stitch Final Strip
                                </button>
                                <button
                                    onClick={downloadImage}
                                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                                >
                                    Download Final Image
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {finalStrip && (
                <div className="mt-6 border rounded overflow-hidden">
                    <img
                        src={`data:image/png;base64,${finalStrip}`}
                        alt="Final Comic Strip"
                        className="w-full object-contain"
                    />
                </div>
            )}
        </div>
    );
}
