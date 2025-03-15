import { Radio } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg p-4 md:p-6 border-b border-white/10">
      <div className="container mx-auto flex items-center gap-4">
        <Radio size={32} className="text-purple-400 animate-pulse" />
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Global Radio Browser
        </h1>
      </div>
    </header>
  );
} 