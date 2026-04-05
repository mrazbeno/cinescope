import FeaturedPanel from '@/components/movie/FeaturedPanel';
import MovieListJsonLd from '@/components/movie/MovieListJsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: "A list of the top-rated movies.",
  title: "Top rated",
  alternates: {canonical: "/top-rated"},
}

export default async function MyPage() {
    const url = "https://api.themoviedb.org/3/movie/top_rated";

    return (
        <>
            <MovieListJsonLd targetURL={url} />
            <FeaturedPanel title="Top Rated" url={url} />
        </>
    );
}