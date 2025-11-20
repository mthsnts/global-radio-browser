import { Search, Filter } from 'lucide-react';
import { AdvancedSearchState } from '../types';
import { countries } from '../data/countries';

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
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Quick search by name..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/40 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50 focus:border-green-500 dark:focus:border-green-400 transition-all text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            value={advancedSearch.name}
            onChange={(e) => setAdvancedSearch({ ...advancedSearch, name: e.target.value })}
          />
        </div>
        <button
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          className="p-3 rounded-xl bg-white/20 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all"
        >
          <Filter className={`${showAdvancedSearch ? 'text-green-400 dark:text-green-500' : 'text-gray-400 dark:text-gray-500'}`} />
        </button>
      </div>

      {showAdvancedSearch && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/20 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700">
          <select
            className="px-4 py-2 rounded-lg bg-white/40 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50 text-black dark:text-gray-100"
            value={advancedSearch.country}
            onChange={(e) => setAdvancedSearch({ ...advancedSearch, country: e.target.value })}
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tags"
            className="px-4 py-2 rounded-lg bg-white/40 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50 text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            value={advancedSearch.tags}
            onChange={(e) => setAdvancedSearch({ ...advancedSearch, tags: e.target.value })}
          />
        </div>
      )}
    </div>
  );
} 