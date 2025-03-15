import { Music2 } from 'lucide-react';
import AudioPlayer from 'react-h5-audio-player';
import { RHAP_UI } from 'react-h5-audio-player';
import type { RadioStation } from '../types';

interface PlayerProps {
  station: RadioStation;
}

export function Player({ station }: PlayerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 transition-transform">
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-4 mb-4">
          {station.favicon ? (
            <img
              src={station.favicon}
              alt={station.name}
              className="w-12 h-12 rounded-xl object-cover shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/purple/white?text=Radio';
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-black/50 flex items-center justify-center">
              <Music2 className="text-purple-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{station.name}</h3>
            <p className="text-sm text-gray-400 truncate">{station.country}</p>
          </div>
        </div>
        <AudioPlayer
          src={station.url_resolved}
          showJumpControls={false}
          layout="stacked"
          customProgressBarSection={[]}
          customControlsSection={[RHAP_UI.MAIN_CONTROLS, RHAP_UI.VOLUME_CONTROLS]}
          autoPlayAfterSrcChange={true}
          className="bg-transparent !shadow-none"
        />
      </div>
    </div>
  );
} 