// ---- /components/StoryPanel.tsx ----
'use client';
import { useState } from 'react';

export default function StoryPanel() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function generate() {
        setLoading(true);
        const res = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });
        if (!res.ok) {
            const text = await res.text();
            console.error('Failed response:', text);
            setLoading(false);
            return;
        }

        const data = await res.json();
        setImageUrl(data.url);
        setLoading(false);
    }

    return (
        <div className="space-y-4">
            <textarea
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Enter scene prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <button onClick={generate} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
                {loading ? 'Generating...' : 'Generate Scene'}
            </button>
            {imageUrl && <img src={imageUrl} alt="Generated scene" className="mt-4" />}
        </div>
    );
}