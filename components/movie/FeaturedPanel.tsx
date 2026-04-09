import Link from "next/link";
import { Button } from "@/components/ui/button";
import MovieGrid, { MovieGridItem } from "@/components/movie/MovieGridClient";
import { fetchTMDBAPIWithCreds } from "@/lib/tmdbApi";

type Props = {
  title: string;
  url: string;
};

const FEATURED_AMOUNT = 20;

export const revalidate = 86400;

export default async function FeaturedPanel({ title, url }: Props) {
  let gridItems: MovieGridItem[] = [];
  let errorFetching = false;

  try {
    const response = await fetchTMDBAPIWithCreds(url, revalidate);

    gridItems = response.map((movie): MovieGridItem => {
        return {
          id: movie.id,
          poster_path: movie.poster_path,
          title: movie.title,
        };
      })
      
    gridItems = gridItems.slice(0, FEATURED_AMOUNT);

  } catch (error) {
    console.error(error);
    errorFetching = true;
  }

  return (
    <main className="flex flex-col w-full h-full min-h-0 justify-start items-stretch py-3 px-8 gap-3">
      <section className="relative flex flex-col w-full items-center justify-center shrink-0 gap-2">
        <h1 className="text-3xl">
          <strong>Top {FEATURED_AMOUNT}</strong> {title} movies
        </h1>

        <div className="relative flex flex-row justify-between items-center w-full">
          <Link href="/">
            <Button type="button" variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>
      </section>

      <section className="flex flex-col flex-1 min-h-0 w-full">
        <MovieGrid
          gridItems={gridItems}
          showPlacement
          errorFetching={errorFetching}
        />
      </section>
    </main>
  );
}