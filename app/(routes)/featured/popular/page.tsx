import FeaturedPanel from '@/components/movie/FeaturedPanel';
import MovieListJsonLd from '@/components/movie/MovieListJsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: "A list of the most popular movies.",
  title: "Most popular",
  alternates: {canonical: "/popular"},
}

export default async function MyPage() {
    const url = "https://api.themoviedb.org/3/movie/popular";

    return (
        <>
            <MovieListJsonLd targetURL={url} />
            <FeaturedPanel title="Popular" url={url} />
        </>
    );
}