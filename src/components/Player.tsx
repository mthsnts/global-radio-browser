import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Heart, Loader2, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import type { RadioStation } from '../types';
import { cn } from '@/lib/utils';
import { registerClick } from '../lib/radioBrowser';
import { stationLocation, stationTags } from '../lib/stationVisuals';
import { StationAvatar } from './StationAvatar';

interface PlayerProps {
  station: RadioStation;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (station: RadioStation) => void;
}

type Status = 'loading' | 'playing' | 'paused' | 'error';

const VOLUME_KEY = 'volume';

// Browsers try to upgrade http:// audio to https:// on a secure page; when the station has no https stream it fails.
function playbackErrorMessage(url: string) {
  if (window.location.protocol === 'https:' && url.startsWith('http://')) {
    return 'Esta rádio só tem transmissão sem segurança, que o navegador bloqueou.';
  }
  return 'Não foi possível tocar esta rádio agora. Tente outra.';
}

function readStoredVolume() {
  try {
    const stored = Number(localStorage.getItem(VOLUME_KEY));
    return Number.isFinite(stored) && stored > 0 && stored <= 1 ? stored : 0.7;
  } catch {
    return 0.7;
  }
}

export function Player({ station, onClose, isFavorite, onToggleFavorite }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(readStoredVolume);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setError(null);
    setStatus('loading');
    audio.src = station.url_resolved;
    audio.play().catch((err: Error) => {
      // NotAllowedError is the browser's autoplay policy, not a broken stream; the user can press play.
      if (err.name === 'NotAllowedError') setStatus('paused');
    });
    registerClick(station.stationuuid);
  }, [station.stationuuid, station.url_resolved]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
    try {
      localStorage.setItem(VOLUME_KEY, String(volume));
    } catch {
      // Storage unavailable; the volume still applies for this session.
    }
  }, [volume, muted]);

  // Stop the stream when the player is closed, otherwise the audio keeps downloading.
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (status === 'playing' || status === 'loading') {
      audio.pause();
    } else {
      setError(null);
      setStatus('loading');
      // Reloading jumps back to the live point instead of resuming stale buffered audio.
      audio.src = station.url_resolved;
      audio.play().catch(() => {});
    }
  };

  // Lock screen and headphone controls.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: station.name,
      artist: stationLocation(station),
      artwork: station.favicon ? [{ src: station.favicon }] : [],
    });
    navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play().catch(() => {}));
    navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
    };
  }, [station]);

  const subtitle = [stationLocation(station), stationTags(station).join(', '), station.bitrate > 0 ? `${station.bitrate} kbps` : '']
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="fixed inset-x-0 bottom-[68px] z-40 px-2 pb-2 md:bottom-0 md:px-0 md:pb-0">
      <audio
        ref={audioRef}
        preload="none"
        onPlaying={() => setStatus('playing')}
        onPause={() => setStatus((current) => (current === 'error' ? current : 'paused'))}
        onWaiting={() => setStatus('loading')}
        onError={() => {
          if (!audioRef.current?.getAttribute('src')) return;
          setStatus('error');
          setError(playbackErrorMessage(station.url_resolved));
        }}
      />
      <div className="mx-auto flex max-w-7xl items-center gap-3 rounded-2xl border bg-card/95 p-2 shadow-2xl backdrop-blur-lg md:gap-6 md:rounded-none md:border-x-0 md:border-b-0 md:bg-background/95 md:px-8 md:py-3.5 md:shadow-none">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-3.5">
          <StationAvatar
            station={station}
            playing={status === 'playing'}
            className="h-11 w-11 rounded-[10px] md:h-14 md:w-14 md:rounded-xl"
            initialsClassName="text-base md:text-lg"
          />
          <div className="flex min-w-0 flex-col gap-0.5 md:gap-1">
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-bold md:text-base">{station.name}</span>
              <span className="hidden shrink-0 rounded bg-brand px-1.5 py-0.5 text-[11px] font-bold tracking-wider text-brand-foreground sm:inline">
                AO VIVO
              </span>
            </span>
            {error ? (
              <span className="flex min-w-0 items-center gap-1 text-xs text-destructive" role="alert">
                <AlertTriangle size={12} className="shrink-0" aria-hidden="true" />
                <span className="truncate" title={error}>{error}</span>
              </span>
            ) : (
              <span className="truncate text-xs text-muted-foreground md:text-[13px]">{subtitle}</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-14 md:w-14"
          aria-label={status === 'playing' || status === 'loading' ? 'Pausar' : 'Tocar'}
        >
          {status === 'loading' ? (
            <Loader2 size={22} className="animate-spin" />
          ) : status === 'playing' ? (
            <Pause size={22} className="fill-current" />
          ) : (
            <Play size={22} className="ml-0.5 fill-current" />
          )}
        </button>

        <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
          <button
            type="button"
            onClick={() => onToggleFavorite(station)}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
            aria-pressed={isFavorite}
          >
            <Heart size={20} className={cn(isFavorite ? 'fill-brand text-brand' : 'text-muted-foreground')} />
          </button>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={muted ? 'Ativar som' : 'Silenciar'}
          >
            {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              setMuted(false);
            }}
            aria-label="Volume"
            className="w-28 accent-[hsl(var(--brand))]"
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Fechar player"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
