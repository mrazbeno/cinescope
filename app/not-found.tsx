import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you were looking for does not exist.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Back to Home</Link>
      </Button>
    </main>
  );
}