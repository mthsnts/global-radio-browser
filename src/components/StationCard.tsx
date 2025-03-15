import { Music2, Globe } from 'lucide-react';
import type { RadioStation } from '../types';

interface StationCardProps {
  station: RadioStation;
  onClick: (station: RadioStation) => void;
}

export function StationCard({ station, onClick }: StationCardProps) {
  return (
    <div
      className="group bg-black/30 backdrop-blur-sm rounded-xl p-4 md:p-6 cursor-pointer hover:bg-black/40 transition-all hover:scale-102 hover:shadow-xl hover:shadow-purple-500/10"
      onClick={() => onClick(station)}
    >
      <div className="flex items-start gap-4">
        {station.favicon ? (
          <img
            src={station.favicon}
            alt={station.name}
            className="w-16 h-16 rounded-xl object-cover bg-black/50 group-hover:shadow-lg transition-all"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/purple/white?text=Radio';
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-all">
            <Music2 className="text-purple-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{station.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Globe size={14} />
            <span className="truncate">{station.country}</span>
          </div>
          <div className="mt-2 text-sm text-purple-400 truncate">
            {station.tags.split(',').slice(0, 3).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
} 