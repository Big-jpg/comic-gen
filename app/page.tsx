// ---- /app/page.tsx ----
import StoryPanel from '@/components/StoryPanel';

const MODIFIERS = [
  'editorial',
  'manga',
  'cyberpunk',
  'noir',
  'saturday morning',
  'flat vector',
  'golden age',
  'pixel art',
  'pastel sketch'
];

export default function Home() {
  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Visual Storyline Generator</h1>
        <p className="text-gray-600">Transform your ideas into illustrated comic strips</p>
      </header>

      <StoryPanel modifiers={MODIFIERS} />
    </main>
  );
}
