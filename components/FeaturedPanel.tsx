
import Link from 'next/link';
import {  TMDBMovieSummary } from '@/lib/TMDBTypes';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import MovieGrid from '@/components/MovieGrid.server';
import { getMovies } from '@/lib/utils';
import { MovieGridSkeleton } from './MovieGrid.client';

type Props = {
    title: string
    url: string
};

const FEATURED_AMOUNT = 20;

export const revalidate = 86400


export default async function FeaturedPanel(props: Props) {    

    const requestPromise = getMovies(props.url, revalidate)

    console.log(await requestPromise);

    const resultsPromise = requestPromise;

    return (
        <main className='flex flex-col w-full h-full min-h-0 justify-start items-stretch py-3 px-8 gap-3'>
                <section className="relative flex flex-col w-full items-center justify-center shrink-0 gap-2">
                    <h1 className='text-3xl'><strong>Top {FEATURED_AMOUNT}</strong> {props.title} movies</h1>
                    <div className='relative flex flex-row justify-between items-center w-full'>
                        <Link href="/">
                            <Button type='button' variant='outline'>Back to Home</Button>
                        </Link>
                    </div>
                </section>

                <section className='flex flex-col flex-1 min-h-0 w-full'>
                    <Suspense fallback={<MovieGridSkeleton />}>
                        <MovieGrid showPlacement={true} resultsPromise={resultsPromise} />
                    </Suspense>
                </section>
        </main>
    );
}
