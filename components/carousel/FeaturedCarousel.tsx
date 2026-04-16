import { Suspense } from "react"
import { CarouselClient } from "./CarouselClient"
import { CarouselSkeleton } from "./CarouselSkeleton"
import { fetchWithTmdbApiCreds } from "@/lib/tmdbApi.server"
import { TMDBListResponse } from "@/lib/tmdbTypes"

export const revalidate = 1800

type FeaturedCarouselProps = {
  isDirForward: boolean
  posterCount: number
  url: string
  labelText: string
}

async function FeaturedCarouselContent(props: FeaturedCarouselProps) {
  // const movies = await fetchTMDBAPIWithCreds(props.url, revalidate)

  const fetchResp = (await fetchWithTmdbApiCreds(props.url, {next: {revalidate }})) 
  const tmdbListResp = await fetchResp.json() as TMDBListResponse
  const movies = tmdbListResp.results
  
  return (
    <CarouselClient
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