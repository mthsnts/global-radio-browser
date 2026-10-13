import { lazy, Suspense, useEffect, useState } from 'react';
import { Heart, Loader2, RotateCw } from 'lucide-react';
import type { RadioStation, AdvancedSearchState } from './types';
import { useInView } from 'react-intersection-observer';
import { useFavorites } from './hooks/useFavorites';
import { useStationSearch } from './hooks/useStationSearch';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { BottomNavigation, type View } from './components/Navigation';
import { StationCard } from './components/StationCard';
import { StationTile } from './components/StationTile';
import { Player } from './components/Player';

// Leaflet is only downloaded when the map is opened.
const StationMap = lazy(() => import('./components/StationMap'));

const TRENDING_COUNT = 5;

function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4">
      <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">{children}</h2>
      {aside}
    </div>
  );
}

function CardSkeletons() {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex items-center gap-3.5 rounded-2xl border bg-card p-3">
          <div className="h-14 w-14 animate-pulse rounded-xl bg-muted" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [advancedSearch, setAdvancedSearch] = useState<AdvancedSearchState>({
    name: '',
    country: '',
    tags: '',
  });
  const [view, setView] = useState<View>('explore');
  const { ref, inView } = useInView();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { stations, loading, loadingMore, error, hasMore, loadMore, retry } = useStationSearch(advancedSearch);

  useEffect(() => {
    if (view === 'explore' && inView && hasMore && !loading && !loadingMore && !error) {
      loadMore();
    }
  }, [view, inView, hasMore, loading, loadingMore, error, loadMore]);

  const changeView = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0 });
  };

  const isPlaying = (station: RadioStation) => currentStation?.stationuuid === station.stationuuid;

  // The "Em alta" row only makes sense for the default ranking, not for a name search.
  const showTrending = !advancedSearch.name.trim() && stations.length > TRENDING_COUNT;
  const trending = showTrending ? stations.slice(0, TRENDING_COUNT) : [];
  const listed = showTrending ? stations.slice(TRENDING_COUNT) : stations;
  const trendingTitle = advancedSearch.country ? `Em alta: ${advancedSearch.country}` : 'Em alta no mundo';

  const renderCard = (station: RadioStation) => (
    <StationCard
      key={station.stationuuid}
      station={station}
      playing={isPlaying(station)}
      onPlay={setCurrentStation}
      isFavorite={isFavorite(station.stationuuid)}
      onToggleFavorite={toggleFavorite}
    />
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        query={advancedSearch.name}
        onQueryChange={(name) => setAdvancedSearch((prev) => ({ ...prev, name }))}
        view={view}
        onViewChange={changeView}
        favoritesCount={favorites.length}
      />

      <main
        className={`mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-5 md:gap-9 md:px-8 md:pt-7 ${
          currentStation ? 'pb-48 md:pb-32' : 'pb-28 md:pb-12'
        }`}
      >
        {view !== 'favorites' && (
          <FilterBar
            country={advancedSearch.country}
            tag={advancedSearch.tags}
            onCountryChange={(country) => setAdvancedSearch((prev) => ({ ...prev, country }))}
            onTagChange={(tags) => setAdvancedSearch((prev) => ({ ...prev, tags }))}
          />
        )}

        {view === 'explore' &&
          (loading ? (
            <CardSkeletons />
          ) : error ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
              <p className="text-destructive">Não foi possível carregar as estações.</p>
              <button
                type="button"
                onClick={retry}
                className="flex h-11 items-center gap-2 rounded-full border px-5 font-semibold hover:bg-secondary"
              >
                <RotateCw size={16} /> Tentar de novo
              </button>
            </div>
          ) : stations.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-lg text-foreground">Nenhuma estação encontrada.</p>
              <p className="text-sm">Tente outro nome, país ou gênero.</p>
            </div>
          ) : (
            <>
              {showTrending && (
                <section className="flex flex-col gap-4">
                  <SectionTitle>{trendingTitle}</SectionTitle>
                  <div className="no-scrollbar -mx-4 grid auto-cols-[42%] grid-flow-col gap-4 overflow-x-auto px-4 sm:auto-cols-[28%] md:mx-0 md:grid-flow-row md:grid-cols-5 md:gap-5 md:overflow-visible md:px-0">
                    {trending.map((station) => (
                      <StationTile key={station.stationuuid} station={station} playing={isPlaying(station)} onPlay={setCurrentStation} />
                    ))}
                  </div>
                </section>
              )}
              <section className="flex flex-col gap-4">
                <SectionTitle aside={<span className="text-sm text-muted-foreground">Mais ouvidas primeiro</span>}>
                  {showTrending ? 'Todas as estações' : 'Resultados'}
                </SectionTitle>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{listed.map(renderCard)}</div>
                {hasMore && (
                  <div ref={ref} className="flex h-20 items-center justify-center text-muted-foreground">
                    <Loader2 className="animate-spin" aria-label="Carregando mais estações" />
                  </div>
                )}
              </section>
            </>
          ))}

        {view === 'favorites' && (
          <section className="flex flex-col gap-4">
            <SectionTitle>Favoritas</SectionTitle>
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
                <Heart size={32} aria-hidden="true" />
                <p className="text-lg text-foreground">Nenhuma rádio favorita ainda.</p>
                <p className="text-sm">Toque no coração de uma estação para guardá-la aqui.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{favorites.map(renderCard)}</div>
            )}
          </section>
        )}

        {view === 'map' && (
          <Suspense
            fallback={
              <div className="flex h-[60vh] items-center justify-center rounded-2xl border text-muted-foreground">
                <Loader2 className="animate-spin" aria-label="Carregando mapa" />
              </div>
            }
          >
            <StationMap
              search={advancedSearch}
              playerOpen={currentStation !== null}
              currentStation={currentStation}
              onPlay={setCurrentStation}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          </Suspense>
        )}
      </main>

      {currentStation && (
        <Player
          station={currentStation}
          onClose={() => setCurrentStation(null)}
          isFavorite={isFavorite(currentStation.stationuuid)}
          onToggleFavorite={toggleFavorite}
        />
      )}
      <BottomNavigation view={view} onChange={changeView} favoritesCount={favorites.length} />
    </div>
  );
}

export default App;
