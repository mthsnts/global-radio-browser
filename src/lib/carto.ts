// CARTO connection settings, read from .env.local (see .env.example).
const baseUrl = import.meta.env.VITE_CARTO_API_BASE_URL?.replace(/\/+$/, '');
const token = import.meta.env.VITE_CARTO_API_TOKEN;

export const cartoConfigured = Boolean(baseUrl && token);

export const cartoConfig = {
  apiBaseUrl: baseUrl ?? '',
  accessToken: token ?? '',
};

// Authenticated fetch against the CARTO API; throws if the env vars are missing.
export async function cartoFetch(path: string, init: RequestInit = {}, signal?: AbortSignal): Promise<Response> {
  if (!cartoConfigured) throw new Error('CARTO is not configured: set VITE_CARTO_API_BASE_URL and VITE_CARTO_API_TOKEN in .env.local');
  return fetch(`${cartoConfig.apiBaseUrl}${path}`, {
    ...init,
    signal,
    headers: { ...init.headers, Authorization: `Bearer ${cartoConfig.accessToken}` },
  });
}
