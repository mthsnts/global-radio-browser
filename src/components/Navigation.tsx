import { Compass, Heart, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

export type View = 'explore' | 'favorites' | 'map';

interface NavigationProps {
  view: View;
  onChange: (view: View) => void;
  favoritesCount: number;
}

const ITEMS: { view: View; label: string; Icon: typeof Compass }[] = [
  { view: 'explore', label: 'Explorar', Icon: Compass },
  { view: 'favorites', label: 'Favoritas', Icon: Heart },
  { view: 'map', label: 'Mapa', Icon: Map },
];

// Segmented control in the header on larger screens.
export function TopNavigation({ view, onChange, favoritesCount }: NavigationProps) {
  return (
    <nav aria-label="Seções" className="hidden items-center gap-1 rounded-xl border bg-secondary p-1 md:flex">
      {ITEMS.map(({ view: item, label }) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          aria-current={view === item ? 'page' : undefined}
          className={cn(
            'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            view === item ? 'bg-background font-semibold text-foreground shadow-sm dark:bg-muted' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {label}
          {item === 'favorites' && favoritesCount > 0 && <span className="ml-1.5 text-muted-foreground">{favoritesCount}</span>}
        </button>
      ))}
    </nav>
  );
}

// Tab bar fixed to the bottom of the screen on phones.
export function BottomNavigation({ view, onChange }: NavigationProps) {
  return (
    <nav
      aria-label="Seções"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 backdrop-blur md:hidden"
    >
      {ITEMS.map(({ view: item, label, Icon }) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          aria-current={view === item ? 'page' : undefined}
          className={cn(
            'flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            view === item ? 'text-brand-strong' : 'text-muted-foreground'
          )}
        >
          <Icon size={22} />
          {label}
        </button>
      ))}
    </nav>
  );
}
