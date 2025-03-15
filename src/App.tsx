import { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Radio, Search, Globe, Music2, Filter } from 'lucide-react';
import type { RadioStation } from './types';
import { RHAP_UI } from 'react-h5-audio-player';
import { useInView } from 'react-intersection-observer';

function App() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [advancedSearch, setAdvancedSearch] = useState({
    name: '',
    country: '',
    tags: '',
    minBitrate: '',
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const { ref, inView } = useInView();

  // Add debounce timeout ref
  const [debouncedAdvancedSearch, setDebouncedAdvancedSearch] = useState(advancedSearch);

  // Debounce the advanced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAdvancedSearch(advancedSearch);
      setPage(1); // Reset to first page when search changes
    }, 500); // Wait 500ms after last keystroke

    return () => clearTimeout(timer);
  }, [advancedSearch]);

  // Update fetch stations to use debounced values
  useEffect(() => {
    fetchStations();
  }, [page, debouncedAdvancedSearch]);

  const fetchStations = async () => {
    try {
      const response = await fetch(
        `https://de1.api.radio-browser.info/json/stations/search?limit=24&offset=${(page - 1) * 24}&order=clickcount&reverse=true&name=${debouncedAdvancedSearch.name}&country=${debouncedAdvancedSearch.country}&tags=${debouncedAdvancedSearch.tags}&minbitrate=${debouncedAdvancedSearch.minBitrate}`
      );
      const data = await response.json();
      setStations(prev => (page === 1 ? data : [...prev, ...data]));
      setHasMore(data.length === 24);
      setLoading(false);
    } catch (err) {
      setError('Failed to load radio stations');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, loading]);

  const filteredStations = stations.filter(station => {
    const matchName = station.name.toLowerCase().includes(advancedSearch.name.toLowerCase());
    const matchCountry = station.country.toLowerCase().includes(advancedSearch.country.toLowerCase());
    const matchTags = advancedSearch.tags ? station.tags.toLowerCase().includes(advancedSearch.tags.toLowerCase()) : true;
    const matchBitrate = advancedSearch.minBitrate ? station.bitrate >= parseInt(advancedSearch.minBitrate) : true;
    return matchName && matchCountry && matchTags && matchBitrate;
  });

  const handleStationClick = (station: RadioStation) => {
    setCurrentStation(station);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg p-4 md:p-6 border-b border-white/10">
        <div className="container mx-auto flex items-center gap-4">
          <Radio size={32} className="text-purple-400 animate-pulse" />
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            World Radio Browser
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Quick search by name..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                value={advancedSearch.name}
                onChange={(e) => setAdvancedSearch(prev => ({ ...prev, name: e.target.value }))}
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
                onChange={(e) => setAdvancedSearch(prev => ({ ...prev, country: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Tags"
                className="px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={advancedSearch.tags}
                onChange={(e) => setAdvancedSearch(prev => ({ ...prev, tags: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Min Bitrate"
                className="px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={advancedSearch.minBitrate}
                onChange={(e) => setAdvancedSearch(prev => ({ ...prev, minBitrate: e.target.value }))}
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-400/30 rounded-full animate-spin">
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-purple-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-purple-400 animate-pulse">Loading stations...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="text-red-400 flex flex-col items-center gap-4">
              <span className="text-5xl">⚠️</span>
              <p>{error}</p>
              <button 
                onClick={fetchStations} 
                className="px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredStations.map((station) => (
              <div
                key={station.stationuuid}
                className="group bg-black/30 backdrop-blur-sm rounded-xl p-4 md:p-6 cursor-pointer hover:bg-black/40 transition-all hover:scale-102 hover:shadow-xl hover:shadow-purple-500/10"
                onClick={() => handleStationClick(station)}
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
            ))}
            {!loading && hasMore && (
              <div ref={ref} className="col-span-full h-20 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full" />
              </div>
            )}
          </div>
        )}
      </main>

      {currentStation && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 transition-transform">
          <div className="container mx-auto p-4">
            <div className="flex items-center gap-4 mb-4">
              {currentStation.favicon ? (
                <img
                  src={currentStation.favicon}
                  alt={currentStation.name}
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
                <h3 className="font-semibold truncate">{currentStation.name}</h3>
                <p className="text-sm text-gray-400 truncate">{currentStation.country}</p>
              </div>
            </div>
            <AudioPlayer
              src={currentStation.url_resolved}
              showJumpControls={false}
              layout="stacked"
              customProgressBarSection={[]}
              customControlsSection={[RHAP_UI.MAIN_CONTROLS, RHAP_UI.VOLUME_CONTROLS]}
              autoPlayAfterSrcChange={true}
              className="bg-transparent !shadow-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;