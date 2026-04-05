"use client";

import Link from "next/link";
import Image from "next/image";
import { getTMDBImage } from "@/lib/tmbd";

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
  const src = posterPath
    ? getTMDBImage(posterPath, "w342") ?? "https://placehold.co/185x278/png"
    : "https://placehold.co/185x278/png";

  return (
    <Link
      href={`/movie-details/${id}`}
      prefetch={false}
      aria-label={`View details for ${title ?? `movie ${id}`}`}
      className="group block h-full"
    >
      <div className="relative h-full aspect-[2/3] overflow-hidden rounded-md bg-stone-900">
        <Image
          src={src}
          alt={title ?? "Movie poster"}
          fill
          className="object-cover"
          sizes="220px"
          quality={50}
        />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 flex items-center justify-center text-white text-sm">
          View details
        </div>
      </div>
    </Link>
  );
}