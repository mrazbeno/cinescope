// lib/tmdb.js

const IMAGE_BASE = 'https://image.tmdb.org/t/p/';

export type TMDBPosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'

export function getTMDBImage(
  path: string | null,
  size: TMDBPosterSize = 'w500'
): string | null {
  return path ? `${IMAGE_BASE}${size}${path}` : null;
}