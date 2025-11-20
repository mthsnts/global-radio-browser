import { Music2 } from 'lucide-react';
import AudioPlayer from 'react-h5-audio-player';
import { RHAP_UI } from 'react-h5-audio-player';
import type { RadioStation } from '../types';

interface PlayerProps {
  station: RadioStation;
}

export function Player({ station }: PlayerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 transition-transform">
      <div className="flex justify-between items-center container mx-auto p-4">
        <div className="flex items-center gap-4 mb-4">
          {station.favicon ? (
            <img
              src={station.favicon}
              alt={station.name}
              className="w-12 h-12 rounded-xl object-cover shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/green/white?text=Radio';
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Music2 className="text-green-400 dark:text-green-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-black dark:text-gray-100">{station.name}</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 truncate">{station.country}</p>
          </div>
        </div>
        <div className="w-[450px]">
        <AudioPlayer
          src={station.url_resolved}
          showJumpControls={false}
          layout="horizontal"
          customProgressBarSection={[]}
          customControlsSection={[RHAP_UI.MAIN_CONTROLS, RHAP_UI.VOLUME_CONTROLS]}
          autoPlayAfterSrcChange={true}
          volume={0.5}
          className="bg-transparent !shadow-none dark:bg-gray-800/95 dark:border-gray-700"
        />
        </div>
      </div>
    </div>
  );
} 