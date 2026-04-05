"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-6">
        <main className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-semibold">App crashed</h1>
          <p className="text-sm text-muted-foreground max-w-md">
            A root-level error occurred.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => reset()}>Try again</Button>
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}