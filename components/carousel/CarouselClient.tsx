"use client"

import * as React from "react"
import Autoplay from "embla-carousel-auto-scroll"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { TMDBMovieSummary } from "@/lib/tmdbTypes"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown } from "lucide-react"
import clsx from "clsx"
import CarouselPoster from "./CarouselPoster.client"

type FeaturedCarouselClientProps = {
  isDirForward: boolean
  posterCount: number
  labelText: string
  movieSummaries: TMDBMovieSummary[]
}

export function CarouselClient(props: FeaturedCarouselClientProps) {
  const autoplay = React.useMemo(
    () =>
      Autoplay({
        speed: 1,
        startDelay: 0,
        stopOnInteraction: true,
        direction: props.isDirForward ? "forward" : "backward",
      }),
    [props.isDirForward]
  )

  const plugins = React.useMemo(() => [autoplay], [autoplay])

  const stopAutoplay = React.useCallback(() => {
    autoplay.stop()
  }, [autoplay])

  const resumeAutoplay = React.useCallback(() => {
    autoplay.play(1000)
  }, [autoplay])

  return (
    <div className="h-full relative flex select-none">
      <Carousel
        opts={{ align: "start", loop: true }}
        orientation="vertical"
        plugins={plugins}
        className="relative h-full *:h-full"
        onMouseEnter={stopAutoplay}
        onMouseLeave={resumeAutoplay}
        onTouchStart={stopAutoplay}
        onTouchEnd={resumeAutoplay}
        onTouchCancel={resumeAutoplay}
        onPointerDown={stopAutoplay}
        onPointerUp={resumeAutoplay}
        onPointerCancel={resumeAutoplay}
      >
        <CarouselContent className="-mt-1 h-full">
          {Array.from({ length: props.posterCount }).map((_, idx) => (
            <CarouselItem key={idx} className="pt-3 shrink min-h-1/4 h-1/4">
              <div className="h-full">
                {props.movieSummaries[idx] == undefined ? (
                  <Skeleton className="h-full aspect-[2/3]" />
                ) : (
                  <CarouselPoster
                    posterPath={props.movieSummaries[idx].poster_path}
                    title={props.movieSummaries[idx].title}
                    id={props.movieSummaries[idx].id}
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div
          className={clsx(
            "absolute h-min! flex items-center justify-between w-full p-3 bg-[var(--color-background)] text-[var(--color-foreground)]",
            { "bottom-0": props.isDirForward, "top-0": !props.isDirForward }
          )}
        >
          {props.labelText}
          {props.isDirForward ? <ArrowUp /> : <ArrowDown />}
        </div>
      </Carousel>
    </div>
  )
}