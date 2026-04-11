"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import MoviePoster from "@/components/movie/MoviePosterClientCard";
import { WatchStatus } from "@/lib/movieStateTypes";


export type MovieGridItem = {
  id: number;
  title: string;
  poster_path: string | null;
  is_favorite?: boolean;
  watch_status?: WatchStatus;
};

type MovieGridClientProps = {
  gridItems: MovieGridItem[];
  showPlacement?: boolean;
  errorFetching?: boolean;
  onRetry?: () => void;
};

const GRID_TEMPLATE = "repeat(auto-fill,minmax(160px,1fr))";

export default function MovieGridClient({
  gridItems,
  showPlacement = false,
  errorFetching = false,
  onRetry,
}: MovieGridClientProps) {
  if (errorFetching) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-md border p-8 text-muted-foreground">
        <div>Failed to load movies.</div>
        {onRetry && (
          <Button type="button" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (gridItems.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-md border p-8 text-sm text-muted-foreground">
        No movies found.
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 rounded-md border overflow-hidden">
      <div
        className="grid gap-4 p-4"
        style={{ gridTemplateColumns: GRID_TEMPLATE }}
      >
        {gridItems.map((movie, i) => {
          return (
            <MoviePoster
              key={movie.id}
              id={movie.id}
              posterPath={movie.poster_path}
              title={movie.title}
              href={`/movie-details/${movie.id}`}
              posterSize="w342"
              revealMode="immediate"
              placement={showPlacement ? i + 1 : undefined}
              isFavorite={movie.is_favorite}
              watchStatus={movie.watch_status}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
}

export function MovieGridClientSkeleton({ count = 12 }: { count?: number }) {
  return (
    <ScrollArea className="flex-1 rounded-md border overflow-hidden">
      <div
        className="grid gap-4 p-4"
        style={{ gridTemplateColumns: GRID_TEMPLATE }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton
            aria-hidden
            key={i}
            className="aspect-[2/3] w-full rounded-md bg-muted"
          />
        ))}
      </div>
    </ScrollArea>
  );
}