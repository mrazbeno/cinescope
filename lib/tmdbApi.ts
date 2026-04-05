import { TMDBMovieSummary } from "./TMDBTypes";

type FetchTMDBMovieListOptions = {
  revalidate?: number;
};

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

  const json = await res.json();
  return (json.results ?? []) as TMDBMovieSummary[];
}