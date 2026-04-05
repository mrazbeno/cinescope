import { supabase } from "@/lib/supabaseBrowser";
import {
  WatchStatus,
  WatchStatusLabels,
  WatchStatusOptions,
  MovieStateRow,
  intitialMovieStateRow,
} from "@/lib/movieStateTypes";

export {
  WatchStatus,
  WatchStatusLabels,
  WatchStatusOptions,
  intitialMovieStateRow,
};

export type { MovieStateRow };

export async function fetchMovieStates(tmdbIds: string[]) {
  if (tmdbIds.length === 0) return [];

  const { data, error } = await supabase
    .from("movie_statuses")
    .select("tmdb_movie_id,is_favorite,watch_status,title,poster_path,release_date")
    .in("tmdb_movie_id", tmdbIds);

  if (error) throw error;
  return (data ?? []) as MovieStateRow[];
}

export const movieUpsertStatesKey = (userId: string, tmdbIds: string[]) =>
  ["movieStates", { userId, tmdbIds }] as const;