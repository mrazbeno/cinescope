"use client";

import Image from "next/image";
import MoviePosterHoverOverlay from "../movie/MoviePosterHoverOverlay.client";
import MoviePosterLink from "../movie/MoviePosterLink.client";
import { getMoviePosterSrc } from "@/lib/tmdbUtility";

type CarouselPosterProps = {
  id: number;
  posterPath: string | null;
  title?: string;
};

export default function CarouselPoster({
  id,
  posterPath,
  title,
}: CarouselPosterProps) {
  const href = `/movie-details/${id}`;
  const src = getMoviePosterSrc(posterPath, "w342");
  const label = title ?? `movie ${id}`;

  return (
    <MoviePosterLink
      href={href}
      ariaLabel={`View details for ${label}`}
      className="group block h-full"
    >
      {({ isPending }) => (
        <div className="relative h-full aspect-[2/3] overflow-hidden rounded-md bg-stone-900">
          <Image
            src={src}
            alt={title ?? "Movie poster"}
            fill
            sizes="220px"
            quality={50}
            className="object-cover"
          />

          <MoviePosterHoverOverlay
            isPending={isPending}
            hoverClassName="group-hover:opacity-100"
            idleLabel="View details"
            pendingLabel="Opening details…"
            idleIcon={null}
          />
        </div>
      )}
    </MoviePosterLink>
  );
}