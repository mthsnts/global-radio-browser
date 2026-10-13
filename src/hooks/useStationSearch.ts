import { useState, useEffect, useCallback } from 'react';
import type { RadioStation, AdvancedSearchState } from '../types';
import { searchStations, PAGE_SIZE } from '../lib/radioBrowser';

const DEBOUNCE_MS = 500;

export function useStationSearch(search: AdvancedSearchState) {
  // Search and page live together so a new search resets the page in the same update (one request, not two).
  const [query, setQuery] = useState({ search, page: 1 });
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(
      () => setQuery((prev) => (prev.search === search ? prev : { search, page: 1 })),
      DEBOUNCE_MS
    );
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchStations(query.search, query.page, controller.signal)
      .then((data) => {
        setStations((prev) => (query.page === 1 ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE_SIZE);
        setLoading(false);
      })
      .catch(() => {
        // An aborted request was superseded by a newer one, which owns the loading state now.
        if (controller.signal.aborted) return;
        setError('Failed to load radio stations');
        setLoading(false);
      });

    return () => controller.abort();
  }, [query, retryCount]);

  const loadMore = useCallback(() => {
    setQuery((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);

  return {
    stations,
    // Only the first page blocks the whole grid; later pages show the spinner at the bottom.
    loading: loading && query.page === 1,
    loadingMore: loading && query.page > 1,
    error,
    hasMore,
    loadMore,
    retry,
  };
}
