import { TMDBListResponse, TMDBMovieSummary } from "./TMDBTypes";

type FetchTMDBMovieListOptions = {
  revalidate?: number;
};

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

export async function fetchTMDBMovieList(
  url: string,
  options?: FetchTMDBMovieListOptions
): Promise<TMDBMovieSummary[]> {
  const init: RequestInit & { next?: { revalidate: number } } = {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN!}`,
      Accept: "application/json",
    },
  };

  if (options?.revalidate !== undefined) {
    init.next = { revalidate: options.revalidate };
  }

  const res = await fetch(url, init);

  if (!res.ok) return [];

  const json = (await res.json()) as TMDBListResponse;
  console.log("GET MOVIE:", url, json);

  return json.results ?? [];
}