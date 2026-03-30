import { WatchStatus } from "@/lib/movieStates";

export type SortingValue =
  | "release_date.asc"
  | "release_date.desc"
  | "title.asc"
  | "title.desc";

const SortingValues: SortingValue[] = [
  "release_date.asc",
  "release_date.desc",
  "title.asc",
  "title.desc",
];

export const SortingValueLabels: Record<SortingValue, string> = {
  "release_date.asc": "Release Date (Oldest → Newest)",
  "release_date.desc": "Release Date (Newest → Oldest)",
  "title.asc": "Title (A → Z)",
  "title.desc": "Title (Z → A)",
};

export const SortingValueOptions = Object.entries(SortingValueLabels).map(
  ([value, label]) => ({
    value: value as SortingValue,
    label,
  })
);

export type MovieStatesFilter = {
  is_favorite: boolean;
  watch_statuses: WatchStatus[];        // empty => no status filter (include all)
  sort_by: SortingValue;               // use a stricter union if you want
};

export const defaultMovieStatesFilter: MovieStatesFilter = {
  is_favorite: false,
  watch_statuses: [],
  sort_by: "title.asc",
};

export function encodeFilterToSearchParams(filter: MovieStatesFilter): URLSearchParams {
  const params = new URLSearchParams();

  if (filter.is_favorite !== defaultMovieStatesFilter.is_favorite) {
    params.set("is_favorite", String(filter.is_favorite));
  }

  if (filter.sort_by !== defaultMovieStatesFilter.sort_by) {
    params.set("sort_by", filter.sort_by);
  }

  const uniqueSorted = Array.from(new Set(filter.watch_statuses)).sort();
  for (const s of uniqueSorted) {
    params.append("watch_statuses", s);
  }

  return params;
}

export function EncodeFilterForURL(filter: MovieStatesFilter): string {
  return encodeFilterToSearchParams(filter).toString();
}

const WatchStatusValues = new Set<string>(Object.values(WatchStatus));

function parseBool(v: string | null, fallback: boolean): boolean {
  if (v === null) return fallback;
  if (v === "true") return true;
  if (v === "false") return false;
  return fallback;
}

function parseSortingValue(v: string | null, fallback: SortingValue): SortingValue {
  if (v && SortingValues.includes(v as SortingValue)) return v as SortingValue;
  return fallback;
}

export function DecodeFilterFromURL(urlSegment: string): MovieStatesFilter {
  const def = defaultMovieStatesFilter;
  const params = new URLSearchParams(urlSegment);

  const is_favorite = parseBool(params.get("is_favorite"), def.is_favorite);
  const sort_by = parseSortingValue(params.get("sort_by"), def.sort_by);

  // read repeated keys
  const watch_statuses = params
    .getAll("watch_statuses")
    .filter((s): s is WatchStatus => WatchStatusValues.has(s)) as WatchStatus[];

  return {
    is_favorite,
    sort_by,
    watch_statuses,
  };
}

export const movieStatesKey = (userId: string, filter: MovieStatesFilter) =>
  ["movieStates", { userId, ...filter }] as const;

import { supabase } from '@/lib/supabaseBrowser';
import type { TMDBListResponse, TMDBMovieSummary } from '@/lib/TMDBTypes';

export type MyListFetchResult = {
  tmbdListResponse: TMDBListResponse
  myListDetails?: MyListMovieDetails
}

export type MyListMovieDetails = {status?: WatchStatus, isFav: boolean}[]

export async function fetchMyListPage(
  userId: string,
  filter: MovieStatesFilter,
  page: number,
  pageSize = 20
): Promise<MyListFetchResult> {

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from("movie_statuses")
    .select(
      `
      tmdb_movie_id,
      title,
      poster_path,
      release_date,
      watch_status,
      is_favorite
      `,
      { count: "exact" }
    )
    .eq("user_id", userId)
    .range(from, to);

  if (filter.is_favorite) {
    q = q.eq("is_favorite", true);
  }

  if (filter.watch_statuses.length > 0) {
    q = q.in("watch_status", filter.watch_statuses);
  }

  const sortMap = {
    "title.asc": { col: "title", ascending: true },
    "title.desc": { col: "title", ascending: false },
    "release_date.asc": { col: "release_date", ascending: true },
    "release_date.desc": { col: "release_date", ascending: false },
  } as const;

  const s = sortMap[filter.sort_by];
  q = q.order(s.col, { ascending: s.ascending, nullsFirst: false });

  const { data, count, error } = await q;

  if (error) throw error;

  const totalResults = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const summaries: TMDBMovieSummary[] = (data ?? []).map(r => ({
    id: Number(r.tmdb_movie_id),
    title: r.title ?? "",
    poster_path: r.poster_path,
    release_date: r.release_date ?? "",
    adult: false,
    backdrop_path: null,
    genre_ids: [],
    original_language: "",
    original_title: r.title ?? "",
    overview: "",
    popularity: 0,
    video: false,
    vote_average: 0,
    vote_count: 0,
  }));

  const details: MyListMovieDetails = (data ?? []).map(r => ({
    isFav: r.is_favorite,
    status: r.watch_status
  }));

  const tmbdResp: TMDBListResponse = {
    results: summaries,
    page,
    total_results: totalResults,
    total_pages: totalPages
  }

  const myListResp: MyListFetchResult = {
    tmbdListResponse: tmbdResp,
    myListDetails: details
  }

  return myListResp
}

export default {}