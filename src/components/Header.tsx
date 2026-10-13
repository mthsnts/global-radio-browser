import { Moon, Search, Sun, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TopNavigation, type View } from './Navigation';

interface HeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  view: View;
  onViewChange: (view: View) => void;
  favoritesCount: number;
}

function Logo() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand text-brand-foreground">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="2" />
        <path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5" />
      </svg>
    </span>
  );
}

export function Header({ query, onQueryChange, view, onViewChange, favoritesCount }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 md:px-8 md:py-4">
        <a href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Logo />
          <span className="font-display text-lg font-bold tracking-tight md:text-xl">Global Radio</span>
        </a>

        <button
          type="button"
          onClick={toggleTheme}
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl border bg-secondary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:order-last md:ml-0"
          aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <label className="order-last flex h-11 w-full items-center gap-2.5 rounded-xl border bg-secondary px-3.5 focus-within:border-brand md:order-none md:w-auto md:flex-1">
          <Search size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Buscar estações</span>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar rádio pelo nome"
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </label>

        <TopNavigation view={view} onChange={onViewChange} favoritesCount={favoritesCount} />
      </div>
    </header>
  );
}
