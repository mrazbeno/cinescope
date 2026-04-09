"use client";

import * as React from "react";
import {
  Heart,
  Clock,
  Pause,
  Square,
  Play,
  Check,
  type LucideIcon,
} from "lucide-react";

import MoviePosterImage from "./MoviePosterImage.client";
import MoviePosterLink from "./MoviePosterLink.client";
import MoviePosterHoverOverlay from "./MoviePosterHoverOverlay.client";

import { WatchStatus } from "@/lib/movieStateTypes";
import { getMoviePosterSrc } from "@/lib/tmdbApi";
import type { TMDBPosterSize } from "@/lib/tmdbTypes";

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

type WatchStatusMeta = {
  label: string;
  Icon: LucideIcon;
  iconStroke: string;
  textClassName: string;
};

const WATCH_STATUS_META: Partial<Record<WatchStatus, WatchStatusMeta>> = {
  [WatchStatus.Planning]: {
    label: "Planning",
    Icon: Clock,
    iconStroke: "white",
    textClassName: "text-white",
  },
  [WatchStatus.Watching]: {
    label: "Watching",
    Icon: Play,
    iconStroke: "white",
    textClassName: "text-white",
  },
  [WatchStatus.Paused]: {
    label: "Paused",
    Icon: Pause,
    iconStroke: "white",
    textClassName: "text-white",
  },
  [WatchStatus.Dropped]: {
    label: "Dropped",
    Icon: Square,
    iconStroke: "white",
    textClassName: "text-white",
  },
  [WatchStatus.Completed]: {
    label: "Completed",
    Icon: Check,
    iconStroke: "#3BD938",
    textClassName: "text-[#3BD938]",
  },
};

function WatchStatusBadge({ status }: { status?: WatchStatus }) {
  if (!status) return null;

  const meta = WATCH_STATUS_META[status];
  if (!meta) return null;

  const { Icon, label, iconStroke, textClassName } = meta;

  return (
    <div className="relative z-10 flex h-full flex-row items-center gap-1 p-1 font-bold">
      <Icon strokeWidth={2} stroke={iconStroke} />
      <span className={textClassName}>{label}</span>
    </div>
  );
}

export default function MoviePosterClientCard({
  id,
  posterPath,
  posterSize = "w185",
  title,
  placement,
  href,
  isFavorite = false,
  watchStatus,
  priority = false,
  revealMode = "immediate",
  onReadyKey,
  sizes = "(max-width: 768px) 120px, 185px",
}: Props) {
  const src = getMoviePosterSrc(posterPath, posterSize);
  const ariaLabel = `View details for ${title ?? `movie ${id}`}`;

  return (
    <MoviePosterLink
      href={href}
      ariaLabel={ariaLabel}
      className="group block"
    >
      {({ isPending }) => (
        <div className="relative flex size-full select-none flex-col overflow-hidden rounded-md bg-stone-900">
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
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute right-0 top-0 h-0 w-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-black dark:border-t-white" />
                <div className="absolute right-0 top-0 rotate-45 p-1 text-lg font-bold text-white dark:text-black">
                  #{placement}
                </div>
              </div>
            )}

            {title && (
              <div className="pointer-events-none absolute bottom-0 w-full truncate bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 text-sm text-white">
                {title}
              </div>
            )}

            {(isFavorite || watchStatus) && (
              <div className="pointer-events-none absolute left-0 top-0 flex w-full justify-between bg-gradient-to-b from-black/90 via-black/60 to-transparent p-2">
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

            {href && <MoviePosterHoverOverlay isPending={isPending} />}
          </div>
        </div>
      )}
    </MoviePosterLink>
  );
}