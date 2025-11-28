import { Music2 } from 'lucide-react';
import AudioPlayer from 'react-h5-audio-player';
import { RHAP_UI } from 'react-h5-audio-player';
import type { RadioStation } from '../types';

interface PlayerProps {
  station: RadioStation;
}

export function Player({ station }: PlayerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <div className="container mx-auto max-w-4xl pointer-events-auto">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl p-4 flex items-center gap-4 md:gap-6">

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
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-0.5 h-3">
                  <div className="w-0.5 bg-green-500 rounded-full playing-bar" style={{ animationDelay: '0s' }}></div>
                  <div className="w-0.5 bg-green-500 rounded-full playing-bar" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-0.5 bg-green-500 rounded-full playing-bar" style={{ animationDelay: '0.1s' }}></div>
                </div>
                <p className="text-xs font-medium text-muted-foreground truncate uppercase tracking-wide">{station.country}</p>
              </div>
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
              className="!bg-transparent !shadow-none !p-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 