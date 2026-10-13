import { useEffect, useState } from 'react';
import type { RadioStation, AdvancedSearchState } from '../types';
import { searchGeoStations } from '../lib/radioBrowser';

const DEBOUNCE_MS = 500;

export function useGeoStations(search: AdvancedSearchState) {
  const [debounced, setDebounced] = useState(search);
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchGeoStations(debounced, controller.signal)
      .then((data) => {
        setStations(data);
        setLoading(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setError('Não foi possível carregar o mapa das estações.');
        setLoading(false);
      });

    return () => controller.abort();
  }, [debounced, retryCount]);

  return { stations, loading, error, retry: () => setRetryCount((count) => count + 1) };
}
