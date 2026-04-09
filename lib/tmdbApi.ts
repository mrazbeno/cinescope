import { TMDBListResponse, TMDBMovieSummary, TMDBPosterSize } from "./tmdbTypes";

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function getNowPlayingMoviesUrl(page = 1, region?: string): string {
  if (!region) region = process.env.NEXT_PUBLIC_TMDB_REGION ?? "US"

  const today = new Date();
  const minDate = formatDate(addDays(today, -30));
  const maxDate = formatDate(today);

  return (
    `https://api.themoviedb.org/3/discover/movie` +
    `?include_adult=false` +
    `&include_video=false` +
    `&language=en-US` +
    `&page=${page}` +
    `&region=${region}` +
    `&sort_by=popularity.desc` +
    `&with_release_type=2|3` +
    `&release_date.gte=${minDate}` +
    `&release_date.lte=${maxDate}`
  );
}

export function getPopularMoviesUrl(page = 1): string {
  return (
    `https://api.themoviedb.org/3/discover/movie` +
    `?include_adult=false` +
    `&include_video=false` +
    `&language=en-US` +
    `&page=${page}` +
    `&sort_by=popularity.desc`
  );
}

export function getTopRatedMoviesUrl(page = 1): string {
  return (
    `https://api.themoviedb.org/3/discover/movie` +
    `?include_adult=false` +
    `&include_video=false` +
    `&language=en-US` +
    `&page=${page}` +
    `&sort_by=vote_average.desc` +
    `&without_genres=99,10755` +
    `&vote_count.gte=200`
  );
}

export function getUpcomingMoviesUrl(page = 1, region?: string): string {
  if (!region) region = process.env.NEXT_PUBLIC_TMDB_REGION ?? "US"

  const today = new Date();
  const minDate = formatDate(today);
  const maxDate = formatDate(addDays(today, 45));

  return (
    `https://api.themoviedb.org/3/discover/movie` +
    `?include_adult=false` +
    `&include_video=false` +
    `&language=en-US` +
    `&page=${page}` +
    `&region=${region}` +
    `&sort_by=primary_release_date.asc` +
    `&with_release_type=2|3` +
    `&release_date.gte=${minDate}` +
    `&release_date.lte=${maxDate}`
  );
}


/**
 * 
 * @param url TMDB API target
 * @param revalidate next cache revalidate
 * @returns List of movies with details from the TMDB API
 * @throws Error on not OK HTTP responses
 */
export async function fetchTMDBAPIWithCreds(
  url: string,
  nextRevalidate?: number
): Promise<TMDBMovieSummary[]> {
  const init: RequestInit & { next?: { revalidate: number } } = {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN!}`,
      Accept: "application/json",
    },
  };

  if (nextRevalidate !== undefined) {
    init.next = { revalidate: nextRevalidate };
  }

  const res = await fetch(url, init);

  if (!res.ok) throw new Error("Failed to fetch movies from TMDB.")

  const json = (await res.json()) as TMDBListResponse;

  return json.results;
}


const IMAGE_BASE = 'https://image.tmdb.org/t/p/';

export function getTMDBImage(
  path: string | null,
  size: TMDBPosterSize = 'w500'
): string | null {
  return path ? `${IMAGE_BASE}${size}${path}` : null;
}


const MOVIE_POSTER_PLACEHOLDER = "https://placehold.co/185x278/png";

export function getMoviePosterSrc(
  posterPath: string | null | undefined,
  size: TMDBPosterSize = "w185"
) {
  if (!posterPath) return MOVIE_POSTER_PLACEHOLDER;
  return getTMDBImage(posterPath, size) ?? MOVIE_POSTER_PLACEHOLDER;
}