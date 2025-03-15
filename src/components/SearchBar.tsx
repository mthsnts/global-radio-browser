import { Search, Filter } from 'lucide-react';
import { AdvancedSearchState } from '../types';

interface SearchBarProps {
  advancedSearch: AdvancedSearchState;
  showAdvancedSearch: boolean;
  setAdvancedSearch: (search: AdvancedSearchState) => void;
  setShowAdvancedSearch: (show: boolean) => void;
}

export function SearchBar({
  advancedSearch,
  showAdvancedSearch,
  setAdvancedSearch,
  setShowAdvancedSearch,
}: SearchBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Quick search by name..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            value={advancedSearch.name}
            onChange={(e) => setAdvancedSearch({ ...advancedSearch, name: e.target.value })}
          />
        </div>
        <button
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          className="p-3 rounded-xl bg-black/20 border border-white/10 hover:bg-black/30 transition-all"
        >
          <Filter className={`${showAdvancedSearch ? 'text-purple-400' : 'text-gray-400'}`} />
        </button>
      </div>

      {showAdvancedSearch && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-black/20 border border-white/10">
          <input
            type="text"
            placeholder="Country"
            className="px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            value={advancedSearch.country}
            onChange={(e) => setAdvancedSearch({ ...advancedSearch, country: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tags"
            className="px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            value={advancedSearch.tags}
            onChange={(e) => setAdvancedSearch({ ...advancedSearch, tags: e.target.value })}
          />
          <input
            type="number"
            placeholder="Min Bitrate"
            className="px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            value={advancedSearch.minBitrate}
            onChange={(e) => setAdvancedSearch({ ...advancedSearch, minBitrate: e.target.value })}
          />
        </div>
      )}
    </div>
  );
} 