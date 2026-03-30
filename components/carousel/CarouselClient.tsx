"use client"

import * as React from "react"
import Autoplay from "embla-carousel-auto-scroll"
import {
  Carousel, CarouselContent, CarouselItem,
} from "@/components/ui/carousel"
import { TMDBMovieSummary } from "@/lib/TMDBTypes"
import MoviePoster from "../MoviePoster"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown } from "lucide-react"
import clsx from "clsx"

type FeaturedCarouselClientProps = {
  isDirForward: boolean
  posterCount: number
  labelText: string
  movieSummaries: TMDBMovieSummary[]
}

export function FeaturedCarouselClient(props: FeaturedCarouselClientProps) {
  // const plugin = React.useRef(
  //   Autoplay({ speed: 1, startDelay: 0, stopOnInteraction: true, direction: (props.isDirForward ? "forward" : "backward") })
  // )

  const autoplay = React.useMemo(
  () => Autoplay({ speed: 1, startDelay: 0, stopOnInteraction: true, direction: props.isDirForward ? "forward" : "backward" }),
  [props.isDirForward]
)


  return (
    <div aria-live="polite" className="h-full relative flex select-none">
      <Carousel
        opts={{ align: "start", loop: true }}
        orientation="vertical"
        plugins={[autoplay]}
        className="relative h-full *:h-full"
        onMouseEnter={autoplay.stop}
        onMouseLeave={() => {autoplay.play(1000) }}
      >
        <CarouselContent className="-mt-1 h-full">
          {Array.from({ length: props.posterCount }).map((_, idx) => (
            <CarouselItem key={idx} className="pt-3 shrink min-h-1/4 h-1/4">
              <div className="h-full">
                {props.movieSummaries[idx] == undefined ? (
                  <Skeleton className="h-full aspect-[2/3]" />
                ) : (
                  <MoviePoster
                    posterPath={props.movieSummaries[idx].poster_path}
                    title={props.movieSummaries[idx].title}
                    id={props.movieSummaries[idx].id}
                    placement={idx + 1}
                    allowRedirection
                    posterSize="w342"
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className={clsx(
          "absolute h-min! flex items-center justify-between w-full p-3 bg-[var(--color-background)] text-[var(--color-foreground)]",
          { "bottom-0": props.isDirForward, "top-0": !props.isDirForward }
        )}>
          {props.labelText}
          {props.isDirForward ? (<ArrowUp />) : (<ArrowDown />)}
        </div>
      </Carousel>
    </div>
  )
}