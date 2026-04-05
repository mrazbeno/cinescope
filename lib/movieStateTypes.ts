export enum WatchStatus {
  Planning = "planning",
  Watching = "watching",
  Paused = "paused",
  Dropped = "dropped",
  Completed = "completed",
}

export const WatchStatusLabels: Record<WatchStatus, string> = {
  [WatchStatus.Planning]: "Planning",
  [WatchStatus.Watching]: "Watching",
  [WatchStatus.Paused]: "Paused",
  [WatchStatus.Dropped]: "Dropped",
  [WatchStatus.Completed]: "Completed",
};

export const WatchStatusOptions = Object.values(WatchStatus).map((value) => ({
  label: WatchStatusLabels[value],
  value,
}));

export type MovieStateRow = {
  tmdb_movie_id: string;
  is_favorite: boolean;
  watch_status: WatchStatus | null;
  title: string | null;
  poster_path: string | null;
  release_date: string | null;
};

export const intitialMovieStateRow: MovieStateRow = {
  tmdb_movie_id: "",
  is_favorite: false,
  watch_status: null,
  title: null,
  poster_path: null,
  release_date: null,
};