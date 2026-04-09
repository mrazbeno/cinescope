import { supabase } from '@/lib/supabaseBrowser';
import {
  MovieStateRow,
  intitialMovieStateRow,
  WatchStatus,
} from '@/lib/movieStateTypes';
import type { MovieStatesFilter } from './movieStateFilters';

export type MovieStatePatch = Partial<
  Pick<MovieStateRow, 'is_favorite' | 'watch_status' | 'title' | 'poster_path' | 'release_date'>
>;

export type MyMovieListItem = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  is_favorite: boolean;
  watch_status?: WatchStatus;
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  total_results: number;
  total_pages: number;
};

function applyFilter<TQuery>(q: any, filter: MovieStatesFilter): TQuery {
  let next = q;

  if (filter.is_favorite) {
    next = next.eq('is_favorite', true);
  }

  if (filter.watch_statuses.length > 0) {
    next = next.in('watch_status', filter.watch_statuses);
  }

  return next as TQuery;
}

function applySort<TQuery>(q: any, sortBy: MovieStatesFilter['sort_by']): TQuery {
  const sortMap = {
    'title.asc': { col: 'title', ascending: true },
    'title.desc': { col: 'title', ascending: false },
    'release_date.asc': { col: 'release_date', ascending: true },
    'release_date.desc': { col: 'release_date', ascending: false },
  } as const;

  const sort = sortMap[sortBy];
  return q.order(sort.col, { ascending: sort.ascending, nullsFirst: false }) as TQuery;
}

export async function fetchMovieState(
  userId: string,
  tmdbMovieId: string
): Promise<MovieStateRow> {
  const { data, error } = await supabase
    .from('movie_statuses')
    .select('tmdb_movie_id,is_favorite,watch_status,title,poster_path,release_date')
    .eq('user_id', userId)
    .eq('tmdb_movie_id', tmdbMovieId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as MovieStateRow | null) ?? intitialMovieStateRow;
}

export async function upsertMovieState(input: {
  userId: string;
  tmdbMovieId: string;
  patch: MovieStatePatch;
}): Promise<void> {
  const { userId, tmdbMovieId, patch } = input;

  const { error } = await supabase
    .from('movie_statuses')
    .upsert(
      {
        user_id: userId,
        tmdb_movie_id: tmdbMovieId,
        ...patch,
      },
      { onConflict: 'user_id,tmdb_movie_id' }
    );

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchMyListPage(
  userId: string,
  filter: MovieStatesFilter,
  page: number,
  pageSize = 20
): Promise<PaginatedResult<MyMovieListItem>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from('movie_statuses')
    .select(
      `
      tmdb_movie_id,
      title,
      poster_path,
      release_date,
      watch_status,
      is_favorite
      `,
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .range(from, to);

  q = applyFilter(q, filter);
  q = applySort(q, filter.sort_by);

  const { data, count, error } = await q;

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  const total_results = count ?? 0;
  const total_pages = Math.max(1, Math.ceil(total_results / pageSize));

  const items: MyMovieListItem[] = rows.map((row) => ({
    id: Number(row.tmdb_movie_id),
    title: row.title ?? '',
    poster_path: row.poster_path,
    release_date: row.release_date ?? null,
    is_favorite: row.is_favorite,
    watch_status: row.watch_status ?? undefined,
  }));

  return {
    items,
    page,
    total_results,
    total_pages,
  };
}