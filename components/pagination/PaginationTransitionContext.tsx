// PaginationTransitionContext.tsx
"use client";

import { createContext, useContext, useTransition } from "react";

const PaginationContext = createContext<{
  isPending: boolean;
  startTransition: (cb: () => void) => void;
} | null>(null);

export function PaginationProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();

  return (
    <PaginationContext.Provider value={{ isPending, startTransition }}>
      {children}
    </PaginationContext.Provider>
  );
}

export function usePaginationTransition() {
  const ctx = useContext(PaginationContext);
  if (!ctx) throw new Error("usePaginationTransition must be inside PaginationProvider");
  return ctx;
}
