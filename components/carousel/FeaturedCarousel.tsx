import { Suspense } from "react"
import { FeaturedCarouselClient } from "./CarouselClient"
import { CarouselSkeleton } from "./CarouselSkeleton"
import { fetchTMDBAPIWithCreds } from "@/lib/tmdbApi"

export const revalidate = 1800

type FeaturedCarouselProps = {
  isDirForward: boolean
  posterCount: number
  url: string
  labelText: string
}

async function FeaturedCarouselContent(props: FeaturedCarouselProps) {
  const movies = await fetchTMDBAPIWithCreds(props.url, revalidate)
  
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