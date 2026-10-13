import { useEffect, useState } from 'react';
import { Music2, X, AlertTriangle } from 'lucide-react';
import AudioPlayer from 'react-h5-audio-player';
import { RHAP_UI } from 'react-h5-audio-player';
import type { RadioStation } from '../types';
import { registerClick } from '../lib/radioBrowser';

interface PlayerProps {
  station: RadioStation;
  onClose: () => void;
}

// Browsers try to upgrade http:// audio to https:// on a secure page; when the station has no https stream it fails.
function playbackErrorMessage(url: string) {
  if (window.location.protocol === 'https:' && url.startsWith('http://')) {
    return "This station only offers an insecure stream, which your browser blocked.";
  }
  return "This station can't be played right now. Try another one.";
}

export function Player({ station, onClose }: PlayerProps) {
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(() => {
    setPlaybackError(null);
    registerClick(station.stationuuid);
  }, [station.stationuuid]);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <div className="container mx-auto max-w-4xl pointer-events-auto">
        <div className="relative bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl p-4 flex items-center gap-4 md:gap-6">
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 p-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close player"
          >
            <X size={16} className="text-gray-600 dark:text-gray-300" />
          </button>

          {/* Station Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative group shrink-0">
              {station.favicon ? (
                <img
                  src={station.favicon}
                  alt={station.name}
                  className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/56x56/green/white?text=Radio';
                  }}
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Music2 className="text-green-500 dark:text-green-400" />
                </div>
              )}
              {/* Visualizer Overlay */}
              <div className="absolute inset-0 flex items-end justify-center gap-1 p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
                <div className="w-1 bg-white rounded-full playing-bar" style={{ animationDelay: '0s' }}></div>
                <div className="w-1 bg-white rounded-full playing-bar" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 bg-white rounded-full playing-bar" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-base truncate text-foreground">{station.name}</h3>
              {playbackError ? (
                <p className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                  <AlertTriangle size={12} className="shrink-0" />
                  <span className="truncate" title={playbackError}>{playbackError}</span>
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-end gap-0.5 h-3">
                    <div className="w-0.5 bg-green-500 rounded-full playing-bar" style={{ animationDelay: '0s' }}></div>
                    <div className="w-0.5 bg-green-500 rounded-full playing-bar" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-0.5 bg-green-500 rounded-full playing-bar" style={{ animationDelay: '0.1s' }}></div>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground truncate uppercase tracking-wide">{station.country}</p>
                </div>
              )}
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex-1 max-w-md">
            <AudioPlayer
              src={station.url_resolved}
              showJumpControls={false}
              layout="horizontal-reverse"
              customProgressBarSection={[]}
              customControlsSection={[RHAP_UI.MAIN_CONTROLS, RHAP_UI.VOLUME_CONTROLS]}
              autoPlayAfterSrcChange={true}
              volume={0.5}
              onPlaying={() => setPlaybackError(null)}
              onError={() => setPlaybackError(playbackErrorMessage(station.url_resolved))}
              onPlayError={(err) => {
                // NotAllowedError is the browser's autoplay policy, not a broken stream; the user can press play.
                if (err.name !== 'NotAllowedError') setPlaybackError(playbackErrorMessage(station.url_resolved));
              }}
              className="!bg-transparent !shadow-none !p-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
