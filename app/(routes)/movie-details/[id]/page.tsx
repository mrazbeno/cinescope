import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MoviePoster from "@/components/movie/MoviePosterClientCard";
import { TMDBMovieDetail, TMDBMovieCreditsResponse } from "@/lib/tmdbTypes";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next"
import MyListActions from "./MyListActions";
import { getTMDBImage } from "@/lib/tmdbUtility";
import { fetchWithTmdbApiCreds } from "@/lib/tmdbApi.server";

export const revalidate: number = 86400;

// Utility: get unique names
function uniqueNames(list: { name: string }[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of list) {
        if (!seen.has(item.name)) {
            seen.add(item.name);
            result.push(item.name);
        }
    }
    return result;
}

async function getMovieDetailsWithCredits(
    id: string
): Promise<TMDBMovieDetail & { credits: TMDBMovieCreditsResponse; }> {

    const url = `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits`

    const fetchResp = (await fetchWithTmdbApiCreds(url, { next: { revalidate } }))

    if (!fetchResp.ok) throw new Error("Failed to fetch movie details");

    return await fetchResp.json()
}

function ButtonLink(
    props: React.ComponentPropsWithoutRef<typeof Link> & {
        variant?: React.ComponentProps<typeof Button>["variant"];
        size?: React.ComponentProps<typeof Button>["size"];
    }
) {
    const { variant, size, children, ...linkProps } = props;
    return (
        <Button asChild variant={variant} size={size}>
            <Link {...linkProps}>
                {children}
            </Link>
        </Button>
    );
}

type Props = {
    params: Promise<{ id: string }>;
};
export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {

    const movieId = (await params).id

    const res = await fetchWithTmdbApiCreds(`https://api.themoviedb.org/3/movie/${movieId}`, { next: { revalidate } })

    if (!res.ok)
        return {
            title: "Movie",
            description: "Explore movie details, cast, and ratings on CineScope.",
            alternates: { canonical: `/movie-details/${movieId}` },
        };

    const movie = await res.json() as TMDBMovieDetail

    const title = movie.title ?? "Movie"
    const description = movie.overview || `Explore details, cast, and ratings for ${title}.`;
    const poster = getTMDBImage(movie.poster_path, "w780")

    const canonical = `/movie-details/${movieId}`

    return {
        title: `${title} (${movie.release_date?.slice(0, 4)})`,
        description,
        alternates: { canonical },

        // OpenGraph (Facebook, LinkedIn)
        openGraph: {
            title,
            description,
            type: "video.movie",
            url: canonical,
            siteName: "CineScope",
            images: poster ? [{ url: poster }] : []
        },

        // Twitter card
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: poster ? [poster] : []
        }
    }
}

export default async function Page({ params }: any) {
    const movieId = (await params).id;
    let detail: TMDBMovieDetail | null = null;
    let credits: TMDBMovieCreditsResponse | null = null;

    try {
        const detResp = await getMovieDetailsWithCredits(movieId);
        detail = detResp
        credits = detResp.credits;
    } catch {
        return <main className="p-4">Failed to load movie data.</main>;
    }

    const year = detail?.release_date
        ? new Date(detail.release_date).getUTCFullYear()
        : undefined;
    const runtimeMins = detail?.runtime ?? 0;
    const runtimeText = runtimeMins
        ? `${Math.floor(runtimeMins / 60)}h ${runtimeMins % 60}m`
        : undefined;

    const director = credits?.crew.find((c) => c.job === "Director");
    const producers = uniqueNames(
        (credits?.crew.filter((c) => c.job.includes("Producer")) || []).slice(0, 5)
    );
    const writers = uniqueNames(
        (credits?.crew.filter((c) => c.department === "Writing") || []).slice(0, 5)
    );
    const topCast = (credits?.cast || [])
        .sort((a, b) => a.order - b.order)
        .slice(0, 5);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: detail?.title,
        image: getTMDBImage(detail?.poster_path, "w780"),
        description: detail?.overview,
        datePublished: detail?.release_date,
        aggregateRating: detail?.vote_average ? {
            "@type": "AggregateRating",
            ratingValue: detail.vote_average.toFixed(1),
            ratingCount: detail.vote_count
        } : undefined,
        director: director ? {
            "@type": "Person",
            name: director.name
        } : undefined,
        actor: topCast.map(c => ({
            "@type": "Person",
            name: c.name,
            url: `https://www.themoviedb.org/person/${c.id}`
        })),
        producer: producers.map(name => ({
            "@type": "Person",
            name
        })),
        author: writers.map(name => ({
            "@type": "Person",
            name
        }))
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="flex flex-col w-full grow relative p-0 overflow-auto">
                <article className="w-full absolute top-0 p-4">
                    <header className="flex items-start justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold">
                                {detail?.title || "Untitled"}
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                {[year, runtimeText].filter(Boolean).join(" • ")}
                            </p>
                            {detail?.tagline && (
                                <p className="mt-2 text-sm italic text-muted-foreground">
                                    {detail.tagline}
                                </p>
                            )}


                        </div>

                        <div className="hidden md:block">
                            <ButtonLink href="/" variant="secondary">
                                Back to Home
                            </ButtonLink>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-8">

                        <div className="flex flex-col gap-2">
                            <aside className="flex justify-center md:block">
                                <div className="w-[240px] md:w-[280px]">
                                    <MoviePoster
                                        posterSize="w780"
                                        posterPath={detail?.poster_path ?? null}
                                        id={detail?.id ?? 0}
                                    />
                                </div>
                            </aside>

                            <section className="flex flex-col gap-2">
                                <MyListActions movieId={movieId} poster_path={detail.poster_path} release_date={detail.release_date} title={detail.title} />
                            </section>
                        </div>


                        <div className="flex flex-col gap-8">


                            <section aria-labelledby="genres-heading">
                                <h2 id="genres-heading" className="sr-only">
                                    Genres
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {detail?.genres.map((g) => (
                                        <Badge key={g.id} variant="secondary">
                                            {g.name}
                                        </Badge>
                                    ))}
                                </div>
                            </section>

                            <section aria-labelledby="overview-heading">
                                <Label id="overview-heading" className="mb-2 block text-base">
                                    Overview
                                </Label>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {detail?.overview || "No overview available."}
                                </p>
                            </section>

                            <section aria-labelledby="stats-heading">
                                <Label id="stats-heading" className="mb-2 block text-base">
                                    Details
                                </Label>
                                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {[{
                                        label: "Rating",
                                        value: detail ? `${detail.vote_average.toFixed(1)} / 10` : "N/A",
                                    },
                                    { label: "Votes", value: detail?.vote_count?.toLocaleString() },
                                    { label: "Runtime", value: runtimeMins ? `${runtimeMins} min` : "N/A" },
                                    { label: "Release", value: detail?.release_date },
                                    { label: "Language", value: detail?.original_language?.toUpperCase() },
                                    { label: "Budget", value: detail ? `$${detail.budget.toLocaleString()}` : "N/A" },
                                    { label: "Revenue", value: detail ? `$${detail.revenue.toLocaleString()}` : "N/A" },
                                    { label: "Popularity", value: detail?.popularity?.toFixed(0) },
                                    { label: "Status", value: detail?.status },
                                    ].map((item, idx) => (
                                        <li key={idx} className="rounded-md border p-3">
                                            <span className="text-xs text-muted-foreground">{item.label}</span>
                                            <span className="mt-1 text-sm font-medium block">{item.value ?? "N/A"}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section aria-labelledby="people-heading">
                                <Label id="people-heading" className="mb-2 block text-base">
                                    Key People
                                </Label>
                                <dl className="flex flex-wrap gap-6 text-sm">
                                    <div className="min-w-[160px]">
                                        <dt className="text-xs text-muted-foreground">Director</dt>
                                        <dd className="font-medium">{director?.name || "N/A"}</dd>
                                    </div>
                                    <div className="min-w-[160px]">
                                        <dt className="text-xs text-muted-foreground">Producers</dt>
                                        <dd className="font-medium">
                                            {producers.length ? producers.join(", ") : "N/A"}
                                        </dd>
                                    </div>
                                    <div className="min-w-[160px]">
                                        <dt className="text-xs text-muted-foreground">Writers</dt>
                                        <dd className="font-medium">
                                            {writers.length ? writers.join(", ") : "N/A"}
                                        </dd>
                                    </div>
                                </dl>
                            </section>

                            <section aria-labelledby="cast-heading">
                                <Label id="cast-heading" className="mb-2 block text-base">
                                    Top Cast
                                </Label>
                                <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {topCast.map((c) => (
                                        <li key={c.id} className="flex flex-col items-center gap-2 text-center">
                                            {c.profile_path ? (
                                                <a
                                                    href={`https://www.themoviedb.org/person/${c.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full"
                                                >
                                                    <div className="relative aspect-[2/3] w-full">
                                                        <Image
                                                            src={getTMDBImage(c.profile_path, "w342") || ""}
                                                            alt={c.name}
                                                            fill
                                                            className="object-cover rounded-md"
                                                            sizes="342px"
                                                        />
                                                    </div>
                                                </a>
                                            ) : (
                                                <div className="relative aspect-[2/3] w-full rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                                    N/A
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-sm font-medium truncate max-w-[10rem]" title={c.name}>
                                                    {c.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate" title={c.character}>
                                                    {c.character}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section aria-labelledby="companies-heading">
                                <Label id="companies-heading" className="mb-2 block text-base">
                                    Production Companies
                                </Label>
                                <ul className="flex flex-wrap gap-2">
                                    {detail?.production_companies.length ? (
                                        detail.production_companies.map((c) => (
                                            <li key={c.id}>
                                                <Badge variant="outline">{c.name}</Badge>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-muted-foreground">N/A</li>
                                    )}
                                </ul>
                            </section>

                            <section aria-labelledby="countries-heading">
                                <Label id="countries-heading" className="mb-2 block text-base">
                                    Production Countries
                                </Label>
                                <ul className="flex flex-wrap gap-2">
                                    {detail?.production_countries.length ? (
                                        detail.production_countries.map((c) => (
                                            <li key={c.iso_3166_1}>
                                                <Badge variant="outline">{c.name}</Badge>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-muted-foreground">N/A</li>
                                    )}
                                </ul>
                            </section>

                            <section aria-labelledby="links-heading">
                                <Label id="links-heading" className="mb-2 block text-base">
                                    Links
                                </Label>
                                <nav aria-label="External links" className="flex flex-wrap gap-3">
                                    {detail?.homepage && (
                                        <a
                                            href={detail.homepage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button size="sm" variant="outline" >
                                                Official Site
                                            </Button>
                                        </a>
                                    )}

                                    {detail?.imdb_id && (
                                        <ButtonLink target="_blank" href={`https://www.imdb.com/title/${detail.imdb_id}`} variant="outline" size="sm">
                                            IMDb
                                        </ButtonLink>
                                    )}
                                </nav>
                            </section>
                        </div>
                    </div>

                    <footer className="mt-8 flex justify-between items-center text-xs text-muted-foreground">
                        <p>Data provided by The Movie Database (TMDB)</p>
                        <ButtonLink href="/" variant="ghost" size="sm">
                            Back to Home
                        </ButtonLink>
                    </footer>
                </article>
            </main>
        </>
    );
}