"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { WatchStatus } from "@/lib/movieStates";
import MoviePosterClientCard from "@/components/movie/MoviePosterClientCard";

type MovieGridMovie = {
  id: number;
  poster_path: string | null;
  title: string;
};

type MyListDetails = {
  status?: WatchStatus;
  isFav: boolean;
};

type MovieGridClientProps = {
  results: MovieGridMovie[];
  myListDetails?: MyListDetails[];
  showPlacement?: boolean;
};

const GRID_TEMPLATE = "repeat(auto-fill,minmax(160px,1fr))";

export default function MovieGridClient({
  results,
  myListDetails,
  showPlacement = false,
}: MovieGridClientProps) {
  if (results.length === 0) {
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
        {results.map((movie, i) => (
          <MoviePosterClientCard
            key={movie.id}
            id={movie.id}
            posterPath={movie.poster_path}
            title={movie.title}
            href={`/movie-details/${movie.id}`}
            posterSize="w342"
            revealMode="immediate"
            placement={showPlacement ? i + 1 : undefined}
            isFavorite={myListDetails?.[i]?.isFav}
            watchStatus={myListDetails?.[i]?.status}
            
          />
        ))}
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