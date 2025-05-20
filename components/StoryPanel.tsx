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

type Panel = {
    visual: string;
    caption: string;
    image?: string;
    accepted: boolean;
};

export default function StoryPanel({ modifiers }: Props) {
    const [prompt, setPrompt] = useState('');
    const [modifier, setModifier] = useState(modifiers[0]);
    const [size, setSize] = useState<SizeKey>('square');
    const [loading, setLoading] = useState(false);
    const [panels, setPanels] = useState<Panel[]>([]);
    const [finalStrip, setFinalStrip] = useState<string | null>(null);

    async function interpret() {
        setLoading(true);
        setPanels([]);
        setFinalStrip(null);

        const res = await fetch('/api/interpret-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ summary: prompt, modifier }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('Interpretation error:', err);
            setLoading(false);
            return;
        }

        const { script } = await res.json();
        const parsed = parsePanels(script);
        setPanels(parsed);
        setLoading(false);
    }

    function parsePanels(script: string): Panel[] {
        const lines = script.split(/\r?\n/).filter(Boolean);
        const regex = /^\d\.\s*Panel\s*\d:\s*(.+?)\s*\(Caption:\s*\"(.*?)\"\)/i;

        return lines.map((line) => {
            const match = regex.exec(line.trim());
            return match
                ? { visual: match[1].trim(), caption: match[2].trim(), accepted: false }
                : { visual: line, caption: '', accepted: false };
        });
    }

    function handleAccept(index: number, image: string) {
        setPanels((prev) =>
            prev.map((p, i) => (i === index ? { ...p, image, accepted: true } : p))
        );
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

            <label className="block font-medium">Visual Style</label>
            <select
                className="w-full p-2 border rounded"
                value={modifier}
                onChange={(e) => setModifier(e.target.value)}
            >
                {modifiers.map((mod) => (
                    <option key={mod} value={mod}>
                        {mod}
                    </option>
                ))}
            </select>

            <label className="block font-medium">Aspect Ratio</label>
            <select
                className="w-full p-2 border rounded"
                value={size}
                onChange={(e) => setSize(e.target.value as SizeKey)}
            >
                {Object.keys(SIZES).map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>

            <button
                onClick={interpret}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition-colors"
            >
                {loading ? 'Processing...' : 'Interpret Script'}
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
                                onAccept={handleAccept}
                            />
                        ))}
                    </div>

                    {panels.every(p => p.accepted) && (
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
