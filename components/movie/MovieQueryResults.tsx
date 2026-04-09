import Link from "next/link";
import { Button } from "@/components/ui/button";
import Paginator from "@/components/pagination/Paginator";
import MovieGrid from "@/components/movie/MovieGridClient";
import { TMDBListResponse } from "@/lib/tmdbTypes";

export const revalidate = 300;

type MovieQueryResultsProps = {
  dataSource: string | (() => Promise<TMDBListResponse>);
};

async function fetchTMDBAPIWithCreds(
  dataSource: string | (() => Promise<TMDBListResponse>)
): Promise<TMDBListResponse> {
  if (typeof dataSource === "string") {
    const res = await fetch(dataSource, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN!}`,
      },
      next: { revalidate },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch movie results");
    }

    return res.json() as Promise<TMDBListResponse>;
  }

  return dataSource();
}

export default async function MovieQueryResultsComponent({
  dataSource,
}: MovieQueryResultsProps) {

  let errorFetching: boolean = false
  let response: TMDBListResponse

  try {
    response = await fetchTMDBAPIWithCreds(dataSource);

  } catch (error) {
    response = {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    }
    errorFetching = true
    console.error(error)
  }

  return (
    <main className="flex flex-col w-full h-full min-h-0 justify-start items-stretch py-3 px-8 gap-3">
      <section className="relative flex flex-col w-full items-center justify-center shrink-0 gap-2">
        <div>
          Found <b>{response.total_results}</b> results...
        </div>

        <div className="relative flex flex-row justify-between items-center w-full">
          <Link href="/">
            <Button type="button" variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>
      </section>

      <section className="flex flex-col flex-1 min-h-0 w-full">
        <MovieGrid gridItems={response.results} errorFetching={errorFetching}/>
      </section>

      <section className="flex w-full justify-center shrink-0">
        <Paginator
          currentPage={response.page}
          totalPages={response.total_pages}
        />
      </section>
    </main>
  );
}