import FeaturedPanel from '@/components/movie/FeaturedPanel';
import MovieListJsonLd from '@/components/movie/MovieListJsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: "A list of the top upcoming movies.",
  title: "Upcoming",
  alternates: {canonical: "/upcoming"},
}

export default async function MyPage() {
    const url = "https://api.themoviedb.org/3/movie/upcoming";

    return (
        <>
            <MovieListJsonLd targetURL={url} />
            <FeaturedPanel title="Upcoming" url={url} />
        </>
    );
}