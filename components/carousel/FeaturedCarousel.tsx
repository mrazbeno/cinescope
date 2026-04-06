import { Suspense } from "react"
import { FeaturedCarouselClient } from "./CarouselClient"
import { TMDBMovieSummary } from "@/lib/TMDBTypes"
import { Skeleton } from "@/components/ui/skeleton"
import { CarouselSkeleton } from "./CarouselSkeleton"
import { getMovies } from "@/lib/utils"

export const revalidate = 1800

type FeaturedCarouselProps = {
  isDirForward: boolean
  posterCount: number
  url: string
  labelText: string
}

async function FeaturedCarouselContent(props: FeaturedCarouselProps) {
  const movies = await getMovies(props.url, revalidate)
  console.log("MOVIES:", props.labelText,  movies);
  
  return (
    <FeaturedCarouselClient
      isDirForward={props.isDirForward}
      posterCount={props.posterCount}
      labelText={props.labelText}
      movieSummaries={movies}
    />
  )
}

export default function FeaturedCarousel(props: FeaturedCarouselProps) {
  return (
    <Suspense fallback={ <CarouselSkeleton {...props} />}>
      <FeaturedCarouselContent {...props} />
    </Suspense>
  )
}