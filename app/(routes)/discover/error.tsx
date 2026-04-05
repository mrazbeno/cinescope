"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    toast.error("Failed to load discover results.");
  }, []);

  return (
    <main className="flex flex-col items-center justify-center gap-4 p-8">
      <p>Something went wrong while loading results.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </main>
  );
}