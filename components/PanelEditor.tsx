// ---- /components/PanelEditor.tsx ----
'use client';
import { useState } from 'react';

interface PanelEditorProps {
    index: number;
    visual: string;
    caption: string;
    size: '1024x1024' | '1024x1792' | '1792x1024';
    quality: 'standard' | 'hd';
    output_format: 'jpeg' | 'png';
    output_compression: number;
    onAccept: (index: number, image: string) => void;
}

export default function PanelEditor({
    index,
    visual,
    caption,
    size,
    quality,
    output_format,
    output_compression,
    onAccept,
}: PanelEditorProps) {
    const [imageData, setImageData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [accepted, setAccepted] = useState(false);

    const prompt = `Draw the following scene: ${visual}. Caption: \"${caption}\"`;

    async function generate() {
        setLoading(true);
        try {
            const res = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, size, quality, output_format, output_compression }),
            });
            if (!res.ok) throw new Error(await res.text());
            const { url } = await res.json();
            setImageData(url);
        } catch (err) {
            console.error(`Panel ${index + 1} generation failed:`, err);
        } finally {
            setLoading(false);
        }
    }

    function accept() {
        if (imageData) {
            setAccepted(true);
            onAccept(index, imageData);
        }
    }

    function reset() {
        setImageData(null);
        setAccepted(false);
    }

    return (
        <div className="border rounded p-4 space-y-2">
            <h3 className="font-bold">Panel {index + 1}</h3>
            <p className="text-sm text-gray-800"><strong>Visual:</strong> {visual}</p>
            <p className="text-sm text-gray-600"><strong>Caption:</strong> “{caption}”</p>

            {!imageData && (
                <button
                    onClick={generate}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {loading ? 'Generating...' : 'Generate Image'}
                </button>
            )}

            {imageData && (
                <div className="space-y-2">
                    <img
                        src={`data:image/${output_format};base64,${imageData}`}
                        alt={`Panel ${index + 1}`}
                        className="w-full object-contain border"
                    />

                    {!accepted ? (
                        <div className="space-x-2">
                            <button
                                onClick={accept}
                                className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                                Accept
                            </button>
                            <button
                                onClick={reset}
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                            >
                                Regenerate
                            </button>
                        </div>
                    ) : (
                        <p className="text-green-700 font-semibold">Accepted ✅</p>
                    )}
                </div>
            )}
        </div>
    );
}
