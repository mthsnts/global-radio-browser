import { Heart } from 'lucide-react';
import type { RadioStation } from '../types';
import { cn } from '@/lib/utils';
import { StationAvatar } from './StationAvatar';
import { stationTags } from '../lib/stationVisuals';

interface StationCardProps {
  station: RadioStation;
  playing: boolean;
  onPlay: (station: RadioStation) => void;
  isFavorite: boolean;
  onToggleFavorite: (station: RadioStation) => void;
}

export function StationCard({ station, playing, onPlay, isFavorite, onToggleFavorite }: StationCardProps) {
  const location = station.state || station.country;

  return (
    <div
      className={cn(
        'group flex items-center gap-3.5 rounded-2xl border p-3 transition-colors',
        playing ? 'border-brand bg-card' : 'border-border bg-card hover:border-input hover:bg-secondary'
      )}
    >
      <button
        type="button"
        onClick={() => onPlay(station)}
        className="flex min-w-0 flex-1 items-center gap-3.5 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Tocar ${station.name}`}
        aria-current={playing ? 'true' : undefined}
      >
        <StationAvatar station={station} playing={playing} className="h-14 w-14" initialsClassName="text-lg" />
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className={cn('truncate text-[15px] font-semibold', playing && 'text-brand-strong')}>{station.name}</span>
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            {station.countrycode && (
              <span className="rounded bg-muted px-1.5 py-px font-bold tracking-wide text-foreground/80">
                {station.countrycode}
              </span>
            )}
            {location && <span className="truncate">{location}</span>}
            {station.bitrate > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="shrink-0">{station.bitrate} kbps</span>
              </>
            )}
          </span>
          {stationTags(station).length > 0 && (
            <span className="flex gap-1.5 overflow-hidden">
              {stationTags(station).map((tag) => (
                <span key={tag} className="truncate rounded-full bg-muted px-2 py-0.5 text-xs text-foreground/80">
                  {tag}
                </span>
              ))}
            </span>
          )}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onToggleFavorite(station)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={isFavorite ? `Remover ${station.name} dos favoritos` : `Favoritar ${station.name}`}
        aria-pressed={isFavorite}
      >
        <Heart
          size={20}
          className={cn(isFavorite ? 'fill-brand text-brand' : 'text-muted-foreground group-hover:text-foreground')}
        />
      </button>
    </div>
  );
}
