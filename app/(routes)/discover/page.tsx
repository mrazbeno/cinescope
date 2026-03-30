import MovieListJsonLd from "@/components/MovieListJsonLd";
import MovieQueryResults from "@/components/MovieQueryResults";
import { buildQueryString } from "@/lib/utils";

type Props = {
    searchParams: Record<string, string | string[] | undefined>;
};

export default async function MyPage({ searchParams }: Props) {
    const query = await buildQueryString(searchParams);
    const targetURL = `https://api.themoviedb.org/3/discover/movie?${query.toString()}`;
    return (
        <>
            <MovieListJsonLd targetURL={targetURL} />
            <MovieQueryResults dataSource={targetURL}/>
        </>
    );
}

export async function generateMetadata({ searchParams }: Props) {
    const params = await buildQueryString(searchParams);
    const page = params.get("page") ?? "1";
    const sort = params.get("sort_by") ?? "popularity.desc";
    const title = `Discover movies — ${sort} — Page ${page}`;
    const description = "Browse and filter movies by ratings, dates, genres, languages, and sort order.";
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const canonical = base ? `${base}/discover?${params.toString()}` : undefined;

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