import { ScrollArea } from '@/components/ui/scroll-area'
import MoviePoster from '@/components/MoviePoster'
import { TMDBMovieSummary } from '@/lib/TMDBTypes'
import { Skeleton } from '@/components/ui/skeleton'
import MovieGridClient from './MovieGrid.client'

type MovieGridProps = {
  resultsPromise: Promise<TMDBMovieSummary[]>
  showPlacement?: boolean
}

export default async function MovieGridServer({ resultsPromise, showPlacement }: MovieGridProps) {
  const results = await resultsPromise
  return <MovieGridClient results={results} showPlacement={showPlacement}/>
}

