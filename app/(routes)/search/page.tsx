import MovieListJsonLd from "@/components/movie/MovieListJsonLd";
import MovieQueryResults from "@/components/movie/MovieQueryResults";
import { buildQueryString } from "@/lib/utils";
import type { Metadata } from "next";

type Props = {
    searchParams: Record<string, string | string[] | undefined>;
};

export default async function MyPage({ searchParams }: any) {
    const query = await buildQueryString(searchParams);
    const targetURL = `https://api.themoviedb.org/3/search/movie?${query.toString()}`;
    return (
        <>
            <MovieListJsonLd targetURL={targetURL} />
            <MovieQueryResults dataSource={targetURL} />
        </>
    );
}

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
    const params = await buildQueryString(searchParams);
    const query = params.get("query") ?? "";
    const page = params.get("page") ?? "1";
    const title = query ? `Search: ${query} — Page ${page}` : `Search movies — Page ${page}`;
    const description = "Search movies by title and explore results with details.";
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const canonical = base ? `${base}/search?${params.toString()}` : undefined;

    return {
        title,
        description,
        alternates: { canonical },
        robots: {
            index: false,
            follow: true
        }
    };
}
