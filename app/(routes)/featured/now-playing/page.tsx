import FeaturedPanel from '@/components/movie/FeaturedPanel';
import MovieListJsonLd from '@/components/movie/MovieListJsonLd';
import { getNowPlayingMoviesUrl } from '@/lib/tmdbApi';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: "A list of the best, currently playing movies.",
  title: "Now playing",
  alternates: { canonical: "/now-playing" },
};

export default async function MyPage() {
  const url = getNowPlayingMoviesUrl(1);

  return (
    <>
      <MovieListJsonLd targetURL={url} />
      <FeaturedPanel title="Now Playing" url={url} />
    </>
  );
}