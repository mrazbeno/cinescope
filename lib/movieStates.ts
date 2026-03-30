import { supabase } from '@/lib/supabaseBrowser';

export enum WatchStatus {
    Planning = "planning",
    Watching = "watching",
    Paused = "paused",
    Dropped = "dropped",
    Completed = "completed"
}

export const WatchStatusLabels: Record<WatchStatus, string> = {
    [WatchStatus.Planning]: "Planning",
    [WatchStatus.Watching]: "Watching",
    [WatchStatus.Paused]: "Paused",
    [WatchStatus.Dropped]: "Dropped",
    [WatchStatus.Completed]: "Completed",
};

export const WatchStatusOptions = Object.values(WatchStatus).map(v => ({
  label: WatchStatusLabels[v],
  value: v,
}));


export type MovieStateRow = {
  tmdb_movie_id: string;
  is_favorite: boolean;
  watch_status: WatchStatus | null;
  title: string | null;
  poster_path: string | null;
  release_date: string | null
};

export const intitialMovieStateRow: MovieStateRow = {
    is_favorite: false,
    poster_path: null,
    title: null,
    release_date: null,
    watch_status: null,
    tmdb_movie_id: ""
} 

export async function fetchMovieStates(tmdbIds: string[]) {
  if (tmdbIds.length === 0) return [];

  const { data, error } = await supabase
    .from('movie_statuses')
    .select('tmdb_movie_id,is_favorite,watch_status,title,poster_path,release_date')
    .in('tmdb_movie_id', tmdbIds);

  if (error) throw error;
  return (data ?? []) as MovieStateRow[];
}

export const movieUpsertStatesKey = (userId: string, tmdbIds: string[]) =>
  ['movieStates', { userId, tmdbIds }] as const;

