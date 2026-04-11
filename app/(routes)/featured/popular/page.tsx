import FeaturedPanel from '@/components/movie/FeaturedPanel';
import MovieListJsonLd from '@/components/movie/MovieListJsonLd';
import { getPopularMoviesUrl } from '@/lib/tmdbUtility';
import type { Metadata } from 'next';

export const revalidate: number= 8640

export const metadata: Metadata = {
  description: "A list of the most popular movies.",
  title: "Most popular",
  alternates: { canonical: "/popular" },
};

export default async function MyPage() {
  const url = getPopularMoviesUrl(1);

  return (
    <>
      <MovieListJsonLd targetURL={url} />
      <FeaturedPanel title="Popular" url={url} revalidate={revalidate} />
    </>
  );
}