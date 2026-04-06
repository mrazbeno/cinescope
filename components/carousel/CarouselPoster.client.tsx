"use client";

import Link from "next/link";
import Image from "next/image";
import { getTMDBImage } from "@/lib/tmbd";
import { useLinkPending } from "@/hooks/useLinkPending";

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
  const { isPending, activate } = useLinkPending(href);

  const src = posterPath
    ? getTMDBImage(posterPath, "w342") ?? "https://placehold.co/185x278/png"
    : "https://placehold.co/185x278/png";

  const label = title ?? `movie ${id}`;

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={`View details for ${label}`}
      aria-busy={isPending}
      className="group block h-full"
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          activate();
        }
      }}
    >
      <div className="relative h-full aspect-[2/3] overflow-hidden rounded-md bg-stone-900">
        <Image
          src={src}
          alt={title ?? "Movie poster"}
          fill
          sizes="220px"
          quality={50}
          className="object-cover"
        />

        <div
          className={[
            "absolute inset-0 z-10 flex flex-col items-center justify-center text-white text-sm transition-opacity",
            isPending
              ? "opacity-100 bg-black/60"
              : "opacity-0 group-hover:opacity-100 bg-black/40",
          ].join(" ")}
        >
          {isPending ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white mb-2" />
              <span>Opening details…</span>
            </>
          ) : (
            <span>View details</span>
          )}
        </div>
      </div>
    </Link>
  );
}