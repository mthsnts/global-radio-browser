import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { countries } from '../data/countries';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Labels shown to the user, mapped to the tag the radio-browser API uses.
const GENRES = [
  { label: 'Todos', tag: '' },
  { label: 'Pop', tag: 'pop' },
  { label: 'Rock', tag: 'rock' },
  { label: 'Notícias', tag: 'news' },
  { label: 'Sertanejo', tag: 'sertanejo' },
  { label: 'MPB', tag: 'mpb' },
  { label: 'Eletrônica', tag: 'electronic' },
  { label: 'Jazz', tag: 'jazz' },
  { label: 'Clássica', tag: 'classical' },
  { label: 'Esportes', tag: 'sports' },
  { label: 'Gospel', tag: 'gospel' },
];

interface FilterBarProps {
  country: string;
  tag: string;
  onCountryChange: (country: string) => void;
  onTagChange: (tag: string) => void;
}

const chipClass =
  'flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function FilterBar({ country, tag, onCountryChange, onTagChange }: FilterBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="no-scrollbar -mx-4 flex items-center gap-2.5 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-label="Filtrar por país"
            className={cn(chipClass, country ? 'border-foreground bg-foreground text-background' : 'border-input bg-secondary text-foreground')}
          >
            <Globe2 size={16} aria-hidden="true" />
            {country || 'Todos os países'}
            <ChevronDown size={14} className="opacity-60" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar país..." />
            <CommandList>
              <CommandEmpty>Nenhum país encontrado.</CommandEmpty>
              <CommandGroup>
                {country && (
                  <CommandItem
                    value="__all__"
                    onSelect={() => {
                      onCountryChange('');
                      setOpen(false);
                    }}
                  >
                    <span className="ml-6">Todos os países</span>
                  </CommandItem>
                )}
                {countries.map((name) => (
                  <CommandItem
                    key={name}
                    value={name}
                    onSelect={() => {
                      onCountryChange(name === country ? '' : name);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', country === name ? 'opacity-100' : 'opacity-0')} />
                    {name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <span className="h-6 w-px shrink-0 bg-border" aria-hidden="true" />

      {GENRES.map((genre) => {
        const active = tag === genre.tag;
        return (
          <button
            key={genre.label}
            type="button"
            onClick={() => onTagChange(genre.tag)}
            aria-pressed={active}
            className={cn(
              chipClass,
              active ? 'border-foreground bg-foreground text-background' : 'border-input bg-transparent text-foreground/80 hover:bg-secondary'
            )}
          >
            {genre.label}
          </button>
        );
      })}
    </div>
  );
}
