// queries/useMovieStates.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseBrowser";
import type { MovieStateRow, WatchStatus } from "@/lib/movieStates";
import type { MovieStatesFilter } from "@/app/(routes)/my-filter/filters";
import { movieStatesKey } from "@/app/(routes)/my-filter/filters";

async function fetchMovieStates(userId: string, filter: MovieStatesFilter) {
  let q = supabase
    .from("movie_statuses")
    .select("*")
    .eq("user_id", userId);

  if (filter.is_favorite) {
    q = q.eq("is_favorite", true);
  }

  if (filter.watch_statuses.length > 0) {
    q = q.in("watch_status", filter.watch_statuses as unknown as WatchStatus[]);
  }

  if (filter.sort_by) {
    const [col, dir] = filter.sort_by.split(".");
    q = q.order(col ?? "title", { ascending: dir === "asc" });
  } else {
    q = q.order("title", { ascending: false });
  }

  const { data, error } = await q;
  if (error) throw error;
  return data as MovieStateRow[];
}

export function useMovieStates(userId: string, filter: MovieStatesFilter) {
  return useQuery({
    queryKey: movieStatesKey(userId, filter),
    queryFn: () => fetchMovieStates(userId, filter),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}
