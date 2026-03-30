import FeaturedPanel from '@/components/FeaturedPanel';
import MovieListJsonLd from '@/components/MovieListJsonLd';

export default async function MyPage() {
    const url = "https://api.themoviedb.org/3/movie/popular";

    return (
        <>
            <MovieListJsonLd targetURL={url} />
            <FeaturedPanel title="Popular" url={url} />
        </>
    );
}