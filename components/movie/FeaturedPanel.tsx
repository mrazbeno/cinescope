import Link from "next/link";
import { Button } from "@/components/ui/button";
import MovieGrid from "@/components/movie/MovieGrid";
import { getMovies } from "@/lib/utils";

type Props = {
  title: string;
  url: string;
};

const FEATURED_AMOUNT = 20;

export const revalidate = 86400;

export default async function FeaturedPanel({ title, url }: Props) {
  const results = await getMovies(url, revalidate);

  console.log("Upcoming movies: ", results)

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
        <MovieGrid results={results.slice(0, FEATURED_AMOUNT)} showPlacement />
      </section>
    </main>
  );
}