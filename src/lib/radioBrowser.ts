import type { RadioStation, AdvancedSearchState } from '../types';

// Public radio-browser mirrors. If one is down we try the next and remember the one that worked.
const SERVERS = [
  'https://de1.api.radio-browser.info',
  'https://de2.api.radio-browser.info',
  'https://fi1.api.radio-browser.info',
];

let preferredServer = 0;

export const PAGE_SIZE = 24;

async function apiFetch(path: string, signal?: AbortSignal): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < SERVERS.length; attempt++) {
    const index = (preferredServer + attempt) % SERVERS.length;
    try {
      const response = await fetch(`${SERVERS[index]}${path}`, { signal });
      if (response.status >= 500) throw new Error(`Server error ${response.status}`);
      preferredServer = index;
      return response;
    } catch (err) {
      if (signal?.aborted) throw err;
      lastError = err;
    }
  }

  throw lastError;
}

export async function searchStations(
  search: AdvancedSearchState,
  page: number,
  signal?: AbortSignal
): Promise<RadioStation[]> {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    offset: String((page - 1) * PAGE_SIZE),
    order: 'clickcount',
    reverse: 'true',
    hidebroken: 'true',
  });

  if (search.name.trim()) params.set('name', search.name.trim());
  if (search.country) {
    params.set('country', search.country);
    params.set('countryExact', 'true');
  }
  if (search.tags.trim()) params.set('tag', search.tags.trim());

  const response = await apiFetch(`/json/stations/search?${params}`, signal);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
}

// The API asks clients to report a click whenever a station starts playing; it feeds the clickcount ranking.
export function registerClick(stationUuid: string) {
  apiFetch(`/json/url/${encodeURIComponent(stationUuid)}`).catch(() => {
    // Best effort: a failed click report must not affect playback.
  });
}
