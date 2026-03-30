import FeaturedPanel from '@/components/FeaturedPanel';
import MovieListJsonLd from '@/components/MovieListJsonLd';

export default async function MyPage() {
    const url = "https://api.themoviedb.org/3/movie/top_rated";

    return (
        <>
            <MovieListJsonLd targetURL={url} />
            <FeaturedPanel title="Top Rated" url={url} />
        </>
    );
}