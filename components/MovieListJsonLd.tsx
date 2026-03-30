import { TMDBMovieSummary } from "@/lib/TMDBTypes";

export default async function MovieListJsonLd({targetURL}: {targetURL: string}) {
    const res = await fetch(targetURL, {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN!}` },
        next: { revalidate: 300 },
    });
    const json = await res.json();
    const items: TMDBMovieSummary[] = (json?.results ?? []);
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "numberOfItems": items.length,
        "itemListElement": items.map((m, idx) => ({
            "@type": "ListItem",
            "url": site ? `${site}/movie-details/${m.id}` : undefined,
            "name": m.title
        }))
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
}