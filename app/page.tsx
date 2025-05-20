// ---- /app/page.tsx ----
import StoryPanel from '@/components/StoryPanel';

export default function Home() {
  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Visual Storyline Generator</h1>
      <StoryPanel />
    </main>
  );
}