"use client";

import * as React from "react";
import Link from "next/link";
import { useLinkPending } from "@/hooks/useLinkPending";

type Props = {
  href?: string;
  ariaLabel?: string;
  className?: string;
  children: (args: { isPending: boolean }) => React.ReactNode;
};

export default function MoviePosterLink({
  href,
  ariaLabel,
  className,
  children,
}: Props) {
  const { isPending, activate } = useLinkPending(href);

  if (!href) {
    return <>{children({ isPending: false })}</>;
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className={className}
      aria-label={ariaLabel}
      aria-busy={isPending}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          activate();
        }
      }}
    >
      {children({ isPending })}
    </Link>
  );
}