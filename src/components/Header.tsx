import { Radio, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Radio size={32} className="text-green-400 dark:text-green-500 animate-pulse" />
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-green-500 dark:from-green-500 dark:to-green-400 bg-clip-text text-transparent">
            Global Radio Browser
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white/20 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Sun className="text-yellow-400" size={20} />
          ) : (
            <Moon className="text-gray-600 dark:text-gray-300" size={20} />
          )}
        </button>
      </div>
    </header>
  );
} 