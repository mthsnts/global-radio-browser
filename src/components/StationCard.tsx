import { Music2, Globe } from 'lucide-react';
import type { RadioStation } from '../types';

interface StationCardProps {
  station: RadioStation;
  onClick: (station: RadioStation) => void;
}

export function StationCard({ station, onClick }: StationCardProps) {
  return (
    <div
      className="group bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm shadow-md rounded-xl p-4 md:p-6 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-all hover:scale-102 hover:shadow-xl hover:shadow-green-500/10 dark:hover:shadow-green-500/20 border border-gray-200 dark:border-gray-700"
      onClick={() => onClick(station)}
    >
      <div className="flex items-start gap-4">
        {station.favicon ? (
          <img
            src={station.favicon}
            alt={station.name}
            className="w-16 h-16 rounded-xl object-cover bg-gray-200 dark:bg-gray-700 group-hover:shadow-md transition-all"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/green/white?text=Radio';
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center group-hover:bg-black/60 dark:group-hover:bg-white/20 transition-all">
            <Music2 className="text-green-400 dark:text-green-500" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate text-black dark:text-gray-100">{station.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <Globe size={14} />
            <span className="truncate">{station.country}</span>
          </div>
          <div className="mt-2 text-sm text-green-400 dark:text-green-500 truncate">
            {station.tags.split(',').slice(0, 3).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
} 