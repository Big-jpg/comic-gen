// ---- /components/PanelLayout.tsx ----
'use client';
import { useState } from 'react';

interface PanelLayoutProps {
    panels: string[]; // base64 images
}

export default function PanelLayout({ panels }: PanelLayoutProps) {
    const [order, setOrder] = useState(panels.map((_, i) => i));

    function move(index: number, direction: 'up' | 'down') {
        const newOrder = [...order];
        const swapWith = direction === 'up' ? index - 1 : index + 1;
        if (swapWith < 0 || swapWith >= order.length) return;
        [newOrder[index], newOrder[swapWith]] = [newOrder[swapWith], newOrder[index]];
        setOrder(newOrder);
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Final Comic Layout</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {order.map((i, idx) => (
                    <div key={i} className="border p-2 rounded relative bg-white">
                        <img
                            src={`data:image/png;base64,${panels[i]}`}
                            alt={`Panel ${i + 1}`}
                            className="w-full object-contain rounded"
                        />
                        <div className="absolute top-2 right-2 space-x-1">
                            <button
                                onClick={() => move(idx, 'up')}
                                className="bg-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-300"
                            >↑</button>
                            <button
                                onClick={() => move(idx, 'down')}
                                className="bg-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-300"
                            >↓</button>
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-1">Panel {i + 1}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
