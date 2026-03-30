
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Paginator from '@/components/pagination/Paginator';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PaginationProvider } from "@/components/pagination/PaginationTransitionContext";
import MovieGrid from '@/components/MovieGrid.server';
import { TMDBListResponse, TMDBMovieSummary } from '@/lib/TMDBTypes';
import { MovieGridSkeleton } from './MovieGrid.client';

async function TotalResults({ promise }: { promise: Promise<number> }) {
    const count = await promise
    return <div className=''>Found <b>{count}</b> results...</div>
}

export const revalidate = 300

export default async function MovieQueryResults({dataSource}: {dataSource: string | (() => Promise<TMDBListResponse>)}) {

    let requestPromise = null
    if (typeof dataSource === "string") {
        requestPromise = fetch(dataSource, {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN!}` },
        next: { revalidate },
      }).then(r => r.json())
    }
    else{
        requestPromise = dataSource();
    }
    
    const resultsPromise = requestPromise.then((res) => res.results as TMDBMovieSummary[]);
    const totalResultsPromise = requestPromise.then((res) => res.total_results as number);

    // const resProm = reqProm.then((res) => res.results as TMDBMovieSummary[]);
    // const cntProm = reqProm.then((res) => res.total_results as number);

    return (
        <main className='flex flex-col w-full h-full min-h-0 justify-start items-stretch py-3 px-8 gap-3'>
            <PaginationProvider>
                <section className="relative flex flex-col w-full items-center justify-center shrink-0 gap-2">
                    <Suspense fallback={<div className='text-sm text-muted-foreground'>Found <Skeleton className='inline-block align-middle h-4 w-16' /> results...</div>}>
                            <TotalResults promise={totalResultsPromise} />
                    </Suspense>
                    <div className='relative flex flex-row justify-between items-center w-full'>
                        <Link href="/">
                            <Button type='button' variant='outline'>Back to Home</Button>
                        </Link>
                    </div>
                </section>

                <section className='flex flex-col flex-1 min-h-0 w-full'>
                    <Suspense fallback={<MovieGridSkeleton />}>
                        <MovieGrid resultsPromise={resultsPromise} />
                    </Suspense>
                </section>
                <section className='flex w-full justify-center shrink-0'>
                    <Suspense fallback={<Skeleton className='w-1/2 h-8' />}>
                        <Paginator currentPage={requestPromise.then((res) => res.page)} totalPages={requestPromise.then((res) => res.total_pages)} />
                    </Suspense>
                </section>
            </PaginationProvider>
        </main>
    );
}
