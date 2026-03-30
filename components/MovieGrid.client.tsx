"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import MoviePoster from '@/components/MoviePoster'
import { TMDBMovieSummary } from '@/lib/TMDBTypes'
import { Skeleton } from '@/components/ui/skeleton'
import { WatchStatus } from '@/lib/movieStates'

type MovieGridProps = {
  results: TMDBMovieSummary[]
  showPlacement?: boolean
  myListDetails?: {status?: WatchStatus, isFav: boolean}[]
}

export default function MovieGridClient({ results, showPlacement, myListDetails}: MovieGridProps) {
  // const results = await resultsPromise

  return (
    <ScrollArea className="flex-1 rounded-md  overflow-hidden ">
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))' }}
      >
        {results.map((v, i) => (
          <MoviePoster
            key={v.id}
            posterPath={v.poster_path}
            id={v.id}
            title={v.title}
            placement={showPlacement ? results.indexOf(v) + 1 : undefined}
            allowRedirection
            posterSize='w342'
            isFavorite={(myListDetails ?? [])[i]?.isFav}
            watchStatus={(myListDetails ?? [])[i]?.status}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

export function MovieGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <ScrollArea className="flex-1 rounded-md border overflow-hidden">
      <div
        className="grid gap-4 p-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))' }}
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
  )
}
