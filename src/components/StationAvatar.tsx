import { useState } from 'react';
import type { RadioStation } from '../types';
import { cn } from '@/lib/utils';
import { stationColor, stationInitials } from '../lib/stationVisuals';

interface StationAvatarProps {
  station: RadioStation;
  playing?: boolean;
  className?: string;
  initialsClassName?: string;
}

export function EqualizerBars({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-end gap-[3px] h-5', className)} aria-hidden="true">
      <span className="w-1 rounded-sm bg-current playing-bar" style={{ animationDelay: '0s' }} />
      <span className="w-1 rounded-sm bg-current playing-bar" style={{ animationDelay: '0.3s' }} />
      <span className="w-1 rounded-sm bg-current playing-bar" style={{ animationDelay: '0.15s' }} />
    </span>
  );
}

// Station logo when it has one that loads; otherwise its initials on a color derived from the station id.
export function StationAvatar({ station, playing = false, className, initialsClassName }: StationAvatarProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(station.favicon) && !logoFailed;

  return (
    <span
      className={cn('relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl', className)}
      style={{ backgroundColor: playing ? 'hsl(var(--brand))' : showLogo ? '#FFFFFF' : stationColor(station.stationuuid) }}
    >
      {showLogo ? (
        <img
          src={station.favicon}
          alt=""
          loading="lazy"
          className={cn('h-full w-full object-cover', playing && 'opacity-30')}
          onError={() => setLogoFailed(true)}
        />
      ) : (
        !playing && (
          <span className={cn('font-display font-bold text-[#0E1116]/80', initialsClassName)}>
            {stationInitials(station.name)}
          </span>
        )
      )}
      {playing && (
        <span className="absolute inset-0 flex items-center justify-center text-brand-foreground">
          <EqualizerBars />
        </span>
      )}
    </span>
  );
}
