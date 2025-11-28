import { Search, Filter, Check, ChevronsUpDown } from 'lucide-react';
import { AdvancedSearchState } from '../types';
import { countries } from '../data/countries';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
  const [open, setOpen] = useState(false);

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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                role="combobox"
                aria-expanded={open}
                className="flex items-center justify-between px-4 py-2 rounded-lg bg-white/40 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50 text-black dark:text-gray-100 w-full text-left"
              >
                {advancedSearch.country
                  ? countries.find((country) => country === advancedSearch.country)
                  : "Select a country..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((country) => (
                      <CommandItem
                        key={country}
                        value={country}
                        onSelect={(currentValue) => {
                          setAdvancedSearch({
                            ...advancedSearch,
                            country: currentValue === advancedSearch.country ? "" : currentValue,
                          })
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            advancedSearch.country === country ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {country}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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