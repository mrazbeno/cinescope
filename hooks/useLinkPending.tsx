"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export function useLinkPending(href?: string) {
  const pathname = usePathname();
  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    setIsPending(false);
  }, [pathname]);

  const activate = React.useCallback(() => {
    if (!href) return;
    if (pathname === href) return;
    setIsPending(true);
  }, [href, pathname]);

  return {
    isPending,
    activate,
  };
}