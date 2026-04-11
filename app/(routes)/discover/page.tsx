import MovieListJsonLd from "@/components/movie/MovieListJsonLd";
import MovieQueryResults from "@/components/movie/MovieQueryResults";
import { buildQueryString } from "@/lib/utils";
import type { Metadata } from "next";

export default async function DiscoverPage({ searchParams }: any) {
    const query = await buildQueryString(searchParams);
    const targetURL = `https://api.themoviedb.org/3/discover/movie?${query.toString()}`;
    return (
        <>
            <MovieListJsonLd targetURL={targetURL} />
            <MovieQueryResults dataSource={targetURL} />
        </>
    );
}

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const params = await buildQueryString(searchParams);

    const page = params.get("page") ?? "1";
    const sort = params.get("sort_by") ?? "popularity.desc";

    const title = `Discover movies — ${sort} — Page ${page}`;
    const description =
        "Browse and filter movies by ratings, dates, genres, languages, and sort order.";

    const normalized = new URLSearchParams(params);
    if (normalized.get("page") === "1") {
        normalized.delete("page");
    }
    if (normalized.get("sort_by") === "popularity.desc") {
        normalized.delete("sort_by");
    }

    const qs = normalized.toString();
    const canonical = qs ? `/discover?${qs}` : "/discover";

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            type: "website",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
        robots: {
            index: false,
            follow: true,
        },
    };
}