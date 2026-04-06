"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, Clock, Pause, Square, Play, Check, Eye } from "lucide-react";
import { getTMDBImage, type TMDBPosterSize } from "@/lib/tmbd";
import { WatchStatus } from "@/lib/movieStates";
import MoviePosterImage from "./MoviePosterImage.client";
import { useLinkPending } from "@/hooks/useLinkPending";

type Props = {
  id: number;
  posterPath: string | null;
  posterSize?: TMDBPosterSize;
  title?: string;
  placement?: number;
  href?: string;
  isFavorite?: boolean;
  watchStatus?: WatchStatus;
  priority?: boolean;
  revealMode?: "immediate" | "wait-image";
  onReadyKey?: string;
  sizes?: string;
};

function WatchStatusBadge({ status }: { status?: WatchStatus }) {
  if (!status) return null;

  switch (status) {
    case WatchStatus.Planning:
      return (
        <div className="relative h-full z-10 p-1 flex flex-row items-center gap-1 font-bold">
          <Clock strokeWidth={2} stroke="white" />
          <span className="text-white">Planning</span>
        </div>
      );
    case WatchStatus.Watching:
      return (
        <div className="relative h-full z-10 p-1 flex flex-row items-center gap-1 font-bold">
          <Play strokeWidth={2} stroke="white" />
          <span className="text-white">Watching</span>
        </div>
      );
    case WatchStatus.Paused:
      return (
        <div className="relative h-full z-10 p-1 flex flex-row items-center gap-1 font-bold">
          <Pause strokeWidth={2} stroke="white" />
          <span className="text-white">Paused</span>
        </div>
      );
    case WatchStatus.Dropped:
      return (
        <div className="relative h-full z-10 p-1 flex flex-row items-center gap-1 font-bold">
          <Square strokeWidth={2} stroke="white" />
          <span className="text-white">Dropped</span>
        </div>
      );
    case WatchStatus.Completed:
      return (
        <div className="relative h-full z-10 p-1 flex flex-row items-center gap-1 font-bold">
          <Check strokeWidth={2} stroke="#3BD938" />
          <span className="text-[#3BD938]">Completed</span>
        </div>
      );
    default:
      return null;
  }
}

export default function MoviePosterClientCard({
  id,
  posterPath,
  posterSize = "w185",
  title,
  placement,
  href,
  isFavorite,
  watchStatus,
  priority = false,
  revealMode = "immediate",
  onReadyKey,
  sizes = "(max-width: 768px) 120px, 185px",
}: Props) {
  const { isPending, activate } = useLinkPending(href);

  const src = posterPath
    ? getTMDBImage(posterPath, posterSize) ?? "https://placehold.co/185x278/png"
    : "https://placehold.co/185x278/png";

  const content = (
    <div className="flex flex-col size-full overflow-hidden relative rounded-md bg-stone-900 select-none">
      <div className="relative h-full aspect-[2/3]">
        <MoviePosterImage
          src={src}
          alt={title ?? "Movie Poster"}
          priority={priority}
          revealMode={revealMode}
          readyKey={onReadyKey}
          sizes={sizes}
        />

        {placement !== undefined && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute right-0 top-0 border-t-[50px] border-t-black dark:border-t-white border-l-[50px] border-l-transparent h-0 w-0" />
            <div className="absolute right-0 top-0 p-1 text-white dark:text-black text-lg font-bold rotate-45">
              #{placement}
            </div>
          </div>
        )}

        {title && (
          <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white text-sm truncate pointer-events-none">
            {title}
          </div>
        )}

        {(isFavorite || watchStatus) && (
          <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/90 via-black/60 to-transparent flex justify-between pointer-events-none">
            {isFavorite ? (
              <div className="relative z-10">
                <Heart strokeWidth={0} fill="red" />
              </div>
            ) : (
              <div />
            )}
            <WatchStatusBadge status={watchStatus} />
          </div>
        )}

        {href && (
          <div
            className={[
              "absolute inset-0 text-white flex flex-col items-center justify-center z-10 transition-opacity",
              isPending
                ? "opacity-100 bg-black/60"
                : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 bg-black/50",
            ].join(" ")}
          >
            {isPending ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white mb-2" />
                <span>Opening details…</span>
              </>
            ) : (
              <>
                <Eye />
                <span>View details</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link
      href={href}
      prefetch={false}
      className="group block"
      aria-label={`View details for ${title ?? `movie ${id}`}`}
      aria-busy={isPending}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          activate();
        }
      }}
    >
      {content}
    </Link>
  ) : (
    content
  );
}