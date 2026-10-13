import { Play } from 'lucide-react';
import type { RadioStation } from '../types';
import { cn } from '@/lib/utils';
import { StationAvatar } from './StationAvatar';
import { stationTags } from '../lib/stationVisuals';

interface StationTileProps {
  station: RadioStation;
  playing: boolean;
  onPlay: (station: RadioStation) => void;
}

// Large square cover used in the "Em alta" row.
export function StationTile({ station, playing, onPlay }: StationTileProps) {
  const subtitle = [station.state || station.country, stationTags(station, 1)[0]].filter(Boolean).join(' · ');

  return (
    <button
      type="button"
      onClick={() => onPlay(station)}
      className="group flex min-w-0 flex-col gap-2.5 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Tocar ${station.name}`}
    >
      <span className="relative block aspect-square w-full">
        <StationAvatar
          station={station}
          playing={playing}
          className="absolute inset-0 h-full w-full rounded-2xl"
          initialsClassName="text-4xl md:text-5xl"
        />
        <span
          className={cn(
            'absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#0E1116] text-white shadow-lg transition-transform',
            'group-hover:scale-105',
            playing && 'hidden'
          )}
          aria-hidden="true"
        >
          <Play size={18} className="ml-0.5 fill-current" />
        </span>
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className={cn('truncate font-semibold', playing && 'text-brand-strong')}>{station.name}</span>
        {subtitle && <span className="truncate text-[13px] text-muted-foreground">{subtitle}</span>}
      </span>
    </button>
  );
}
