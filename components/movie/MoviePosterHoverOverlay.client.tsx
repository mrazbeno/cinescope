"use client";

import { Eye } from "lucide-react";

type Props = {
  isPending: boolean;
  hoverClassName?: string;
  idleLabel?: string;
  pendingLabel?: string;
  idleIcon?: React.ReactNode;
};

export default function MoviePosterHoverOverlay({
  isPending,
  hoverClassName = "group-hover:opacity-100 group-focus-visible:opacity-100",
  idleLabel = "View details",
  pendingLabel = "Opening details…",
  idleIcon,
}: Props) {
  return (
    <div
      className={[
        "absolute inset-0 z-10 flex flex-col items-center justify-center text-white transition-opacity",
        isPending
          ? "opacity-100 bg-black/60"
          : `opacity-0 bg-black/50 ${hoverClassName}`,
      ].join(" ")}
    >
      {isPending ? (
        <>
          <div className="mb-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span>{pendingLabel}</span>
        </>
      ) : (
        <>
          {idleIcon ?? <Eye />}
          <span>{idleLabel}</span>
        </>
      )}
    </div>
  );
}