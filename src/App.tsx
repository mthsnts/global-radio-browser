import { useState, useEffect } from 'react';
import 'react-h5-audio-player/lib/styles.css';
import type { RadioStation, AdvancedSearchState } from './types';
import { useInView } from 'react-intersection-observer';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { StationCard } from './components/StationCard';
import { Player } from './components/Player';

function App() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [advancedSearch, setAdvancedSearch] = useState<AdvancedSearchState>({
    name: '',
    country: '',
    tags: '',
    minBitrate: '',
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const { ref, inView } = useInView();

  const [debouncedAdvancedSearch, setDebouncedAdvancedSearch] = useState(advancedSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAdvancedSearch(advancedSearch);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [advancedSearch]);

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
      <Header />

      <main className="container mx-auto p-4 md:p-6 space-y-8">
        <SearchBar
          advancedSearch={advancedSearch}
          showAdvancedSearch={showAdvancedSearch}
          setAdvancedSearch={setAdvancedSearch}
          setShowAdvancedSearch={setShowAdvancedSearch}
        />

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
              <StationCard
                key={station.stationuuid}
                station={station}
                onClick={handleStationClick}
              />
            ))}
            {!loading && hasMore && (
              <div ref={ref} className="col-span-full h-20 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full" />
              </div>
            )}
          </div>
        )}
      </main>

      {currentStation && <Player station={currentStation} />}
    </div>
  );
}

export default App;