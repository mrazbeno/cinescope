import { TMDBMovieSummary, TMDBListResponse } from "@/lib/tmdbTypes";
import { getTMDBImage } from "@/lib/tmdbUtility";
import { fetchWithTmdbApiCreds } from "@/lib/tmdbApi";

function getAppBaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_APP_URL || undefined;
}

export default async function MovieListJsonLd({
  targetURL,
}: {
  targetURL: string;
}) {
  const res = await fetchWithTmdbApiCreds(targetURL, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return null;
  }

  const json = (await res.json()) as TMDBListResponse;
  const items: TMDBMovieSummary[] = json.results ?? [];

  const site = getAppBaseUrl();

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((movie, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: movie.title,
      url: site ? `${site}/movie-details/${movie.id}` : undefined,
      image: getTMDBImage(movie.poster_path),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
    />
  );
}