import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"

export default function Loading() {
  return (
     <main className="flex flex-col w-full p-4 overflow-auto">
            <article className="w-full max-w-screen-lg mx-auto">
                {/* Header */}
                <header className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold">
                            <Skeleton className="h-7 w-56" />
                        </h1>

                        <div className="mt-1 text-muted-foreground">
                            <Skeleton className="h-4 w-40" />
                        </div>

                        <Skeleton className="h-4 w-64 mt-2" />
                    </div>

                    <div className="hidden md:block">
                        <Skeleton className="h-9 w-28" />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-8">
                    {/* Poster */}
                    <aside className="flex justify-center md:block">
                        <div className="w-[240px] md:w-[280px]">
                            <Skeleton className="h-[360px] md:h-[420px] w-full rounded-md" />
                        </div>
                    </aside>

                    {/* Right Column */}
                    <div className="flex flex-col gap-8">
                        {/* Genres */}
                        <section aria-labelledby="genres-heading">
                            <h2 id="genres-heading" className="sr-only">Genres</h2>
                            <div className="flex flex-wrap gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-6 w-16 rounded-full" />
                                ))}
                            </div>
                        </section>

                        {/* Overview */}
                        <section aria-labelledby="overview-heading">
                            <Label id="overview-heading" className="mb-2 block text-base">
                                Overview
                            </Label>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </section>

                        {/* Stats */}
                        <section aria-labelledby="stats-heading">
                            <Label id="stats-heading" className="mb-2 block text-base">
                                Details
                            </Label>
                            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {Array.from({ length: 9 }).map((_, idx) => (
                                    <li key={idx} className="rounded-md border p-3 space-y-2">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-20" />
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Key People */}
                        <section aria-labelledby="people-heading">
                            <Label id="people-heading" className="mb-2 block text-base">
                                Key People
                            </Label>
                            <dl className="flex flex-wrap gap-6 text-sm">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="min-w-[160px] space-y-2">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                            </dl>
                        </section>

                        {/* Cast */}
                        <section aria-labelledby="cast-heading">
                            <Label id="cast-heading" className="mb-2 block text-base">
                                Top Cast
                            </Label>
                            <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <li key={i} className="flex flex-col items-center gap-2 text-center w-full">
                                        <div className="relative aspect-[2/3] w-full">
                                            <Skeleton className="w-full h-full rounded-md" />
                                        </div>
                                        <div className="space-y-1 flex flex-col items-center w-full">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Production Companies */}
                        <section aria-labelledby="companies-heading">
                            <Label id="companies-heading" className="mb-2 block text-base">
                                Production Companies
                            </Label>
                            <ul className="flex flex-wrap gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <li key={i}>
                                        <Skeleton className="h-5 w-24" />
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Production Countries */}
                        <section aria-labelledby="countries-heading">
                            <Label id="countries-heading" className="mb-2 block text-base">
                                Production Countries
                            </Label>
                            <ul className="flex flex-wrap gap-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <li key={i}>
                                        <Skeleton className="h-5 w-20" />
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Links */}
                        <section aria-labelledby="links-heading">
                            <Label id="links-heading" className="mb-2 block text-base">
                                Links
                            </Label>
                            <nav aria-label="External links" className="flex flex-wrap gap-3">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-20" />
                            </nav>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-8 flex justify-between items-center text-xs text-muted-foreground">
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-8 w-24" />
                </footer>
            </article>
        </main>
  );
}

