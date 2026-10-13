import { useEffect, useMemo } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import { latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Heart, Loader2, Play } from 'lucide-react';
import type { RadioStation, AdvancedSearchState } from '../types';
import { cn } from '@/lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { useGeoStations } from '../hooks/useGeoStations';
import { MAP_LIMIT } from '../lib/radioBrowser';
import { stationLocation, stationTags } from '../lib/stationVisuals';
import { StationAvatar } from './StationAvatar';

interface StationMapProps {
  search: AdvancedSearchState;
  playerOpen: boolean;
  currentStation: RadioStation | null;
  onPlay: (station: RadioStation) => void;
  isFavorite: (stationUuid: string) => boolean;
  onToggleFavorite: (station: RadioStation) => void;
}

// CARTO basemap tiles return a "API KEY REQUIRED" watermark unless the request carries a basemaps key.
const BASEMAPS_KEY = import.meta.env.VITE_CARTO_BASEMAPS_KEY;
const keyParam = BASEMAPS_KEY ? `?key=${encodeURIComponent(BASEMAPS_KEY)}` : '';

const TILES = {
  light: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png${keyParam}`,
  dark: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png${keyParam}`,
};

const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function hasCoordinates(station: RadioStation) {
  return (
    Number.isFinite(station.geo_lat) &&
    Number.isFinite(station.geo_long) &&
    !(station.geo_lat === 0 && station.geo_long === 0)
  );
}

// Zooms the map to the stations whenever the result set changes.
function FitToStations({ stations }: { stations: RadioStation[] }) {
  const map = useMap();
  useEffect(() => {
    if (stations.length === 0) return;
    const bounds = latLngBounds(stations.map((s) => [s.geo_lat, s.geo_long] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }, [map, stations]);
  return null;
}

export default function StationMap({ search, playerOpen, currentStation, onPlay, isFavorite, onToggleFavorite }: StationMapProps) {
  const { isDark } = useTheme();
  const { stations, loading, error, retry } = useGeoStations(search);
  const located = useMemo(() => stations.filter(hasCoordinates), [stations]);

  return (
    <div
      className={cn(
        'relative min-h-[320px] overflow-hidden rounded-2xl border',
        // Leave room for the header, filters, bottom tabs (phone) and the player.
        playerOpen ? 'h-[calc(100dvh-400px)] md:h-[calc(100dvh-330px)]' : 'h-[calc(100dvh-320px)] md:h-[calc(100dvh-240px)]'
      )}
    >
      <MapContainer center={[-14, -52]} zoom={3} minZoom={2} worldCopyJump className="h-full w-full">
        <TileLayer key={isDark ? 'dark' : 'light'} url={isDark ? TILES.dark : TILES.light} attribution={ATTRIBUTION} />
        <FitToStations stations={located} />
        {located.map((station) => {
          const playing = currentStation?.stationuuid === station.stationuuid;
          return (
            <CircleMarker
              key={station.stationuuid}
              center={[station.geo_lat, station.geo_long]}
              radius={playing ? 10 : 6}
              pathOptions={{
                color: isDark ? '#0E1116' : '#FFFFFF',
                weight: 1.5,
                fillColor: playing ? '#FF8A3D' : isDark ? '#9DB4FF' : '#3B5BDB',
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                <div className="flex w-56 flex-col gap-3 font-sans">
                  <div className="flex items-center gap-3">
                    <StationAvatar station={station} className="h-11 w-11 rounded-[10px]" initialsClassName="text-base" />
                    <div className="min-w-0">
                      <p className="m-0 truncate text-sm font-bold text-foreground">{station.name}</p>
                      <p className="m-0 truncate text-xs text-muted-foreground">{stationLocation(station)}</p>
                    </div>
                  </div>
                  {stationTags(station, 3).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {stationTags(station, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onPlay(station)}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-brand-foreground"
                    >
                      <Play size={16} className="fill-current" />
                      {playing ? 'Tocando' : 'Tocar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(station)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border"
                      aria-label={isFavorite(station.stationuuid) ? 'Remover dos favoritos' : 'Favoritar'}
                      aria-pressed={isFavorite(station.stationuuid)}
                    >
                      <Heart
                        size={18}
                        className={cn(isFavorite(station.stationuuid) ? 'fill-brand text-brand' : 'text-muted-foreground')}
                      />
                    </button>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className="pointer-events-none absolute left-14 top-3 z-[1000] flex flex-col gap-2">
        <span className="pointer-events-auto rounded-full border bg-background/90 px-3 py-1.5 text-xs font-semibold shadow backdrop-blur">
          {loading ? (
            <span className="flex items-center gap-1.5">
              <Loader2 size={12} className="animate-spin" /> Carregando estações...
            </span>
          ) : (
            `${located.length} estações no mapa${stations.length >= MAP_LIMIT ? ' (as mais ouvidas)' : ''}`
          )}
        </span>
        {error && (
          <span className="pointer-events-auto flex items-center gap-2 rounded-full border border-destructive/40 bg-background/90 px-3 py-1.5 text-xs font-semibold text-destructive shadow">
            {error}
            <button type="button" onClick={retry} className="underline">
              Tentar de novo
            </button>
          </span>
        )}
        {!loading && !error && located.length === 0 && (
          <span className="pointer-events-auto rounded-full border bg-background/90 px-3 py-1.5 text-xs shadow">
            Nenhuma estação com localização para esses filtros.
          </span>
        )}
      </div>
    </div>
  );
}
