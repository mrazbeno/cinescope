// components/MoviePosterImage.client.tsx
"use client";

import * as React from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  revealMode?: "immediate" | "wait-image";
  readyKey?: string;
  sizes?: string;
};

export default function MoviePosterImage({
  src,
  alt,
  priority = false,
  revealMode = "immediate",
  readyKey,
  sizes = "(max-width: 768px) 120px, 185px",
}: Props) {
  const [loaded, setLoaded] = React.useState(false);
  const hasDispatchedRef = React.useRef(false);

  React.useEffect(() => {
    setLoaded(false);
    hasDispatchedRef.current = false;
  }, [src]);

  React.useEffect(() => {
    if (!loaded) return;
    if (!readyKey) return;
    if (hasDispatchedRef.current) return;

    hasDispatchedRef.current = true;

    window.dispatchEvent(
      new CustomEvent("movie-poster-ready", {
        detail: { key: readyKey },
      })
    );
  }, [loaded, readyKey]);

  return (
    <>
      <div
        className={[
          "absolute inset-0 rounded-md bg-muted transition-opacity duration-300",
          loaded && revealMode === "immediate" ? "opacity-0" : "opacity-100",
        ].join(" ")}
        aria-hidden
      />

      <Image
        src={src}
        alt={alt}
        fill
        className={[
          "object-cover transition-opacity duration-300",
          revealMode === "immediate"
            ? loaded
              ? "opacity-100"
              : "opacity-0"
            : "opacity-100",
        ].join(" ")}
        sizes={sizes}
        priority={priority}
        quality={60}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}