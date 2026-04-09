
import { getTMDBImage } from "@/lib/tmdbApi";
import { TMDBMovieSummary } from "@/lib/tmdbTypes";

export default async function MovieListJsonLd({targetURL}: {targetURL: string}) {
    const res = await fetch(targetURL, {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN!}` },
        next: { revalidate: 300 },
    });
    const json = await res.json();
    const items: TMDBMovieSummary[] = (json?.results ?? []);
    const site = process.env.NEXT_PUBLIC_APP_URL ?? "";
    const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "numberOfItems": items.length,
        "itemListElement": items.map((m, idx) => ({
            "@type": "ListItem",
            "url": site ? `${site}/movie-details/${m.id}` : undefined,
            "name": m.title,
            "position": idx + 1,
            "image": getTMDBImage(m.poster_path)
        }))
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
}