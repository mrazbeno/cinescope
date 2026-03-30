import MovieListJsonLd from "@/components/MovieListJsonLd";
import MovieQueryResults from "@/components/MovieQueryResults";
import { buildQueryString } from "@/lib/utils";

type Props = {
    searchParams: Record<string, string | string[] | undefined>;
};

export default async function MyPage({ searchParams }: Props) {
    const query = await buildQueryString(searchParams);
    const targetURL = `https://api.themoviedb.org/3/search/movie?${query.toString()}`;
    return (
        <>
            <MovieListJsonLd targetURL={targetURL} />
            <MovieQueryResults dataSource={targetURL} />
        </>
    );
}

export async function generateMetadata({ searchParams }: Props) {
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
    };
}
