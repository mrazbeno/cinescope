import FeaturedPanel from '@/components/movie/FeaturedPanel';
import MovieListJsonLd from '@/components/movie/MovieListJsonLd';
import { getUpcomingMoviesUrl } from '@/lib/tmdbUtility';
import type { Metadata } from 'next';

export const revalidate: number= 8640

export const metadata: Metadata = {
  description: "A list of the top upcoming movies.",
  title: "Upcoming",
  alternates: { canonical: "/upcoming" },
};

export default async function MyPage() {
  const url = getUpcomingMoviesUrl(1);

  return (
    <>
      <MovieListJsonLd targetURL={url} />
      <FeaturedPanel title="Upcoming" url={url} revalidate={revalidate} />
    </>
  );
}