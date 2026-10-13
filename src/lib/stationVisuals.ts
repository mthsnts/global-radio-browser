import type { RadioStation } from '../types';

// Cover colors for stations without a logo. Light enough that dark initials stay readable on them.
const COVER_COLORS = ['#F2C14E', '#7FD1B9', '#F28C8C', '#9DB4FF', '#C9A7F2', '#F5A962', '#8FD694', '#F2A7C9'];

export function stationInitials(name: string) {
  const words = name
    .replace(/^(r[aá]dio|radio)\s+/i, '')
    .split(/[\s\-_/|]+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word));
  if (words.length === 0) return '♪';
  // One word ("Globo") reads better as its first two letters than as a lone "G".
  const initials =
    words.length === 1
      ? (words[0].match(/[\p{L}\p{N}]/gu) ?? []).slice(0, 2).join('')
      : words.slice(0, 2).map((word) => word.match(/[\p{L}\p{N}]/u)?.[0] ?? '').join('');
  return initials.toUpperCase();
}

export function stationColor(stationUuid: string) {
  let hash = 0;
  for (let i = 0; i < stationUuid.length; i++) {
    hash = (hash * 31 + stationUuid.charCodeAt(i)) | 0;
  }
  return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length];
}

export function stationTags(station: RadioStation, max = 2) {
  return station.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, max);
}

export function stationLocation(station: RadioStation) {
  return [station.state, station.country].filter(Boolean).join(', ');
}
