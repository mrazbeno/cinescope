import FeaturedPanel from '@/components/FeaturedPanel';
import MovieListJsonLd from '@/components/MovieListJsonLd';

export default async function MyPage() {
    const url = "https://api.themoviedb.org/3/movie/now_playing";

    return (
        <>
            <MovieListJsonLd targetURL={url} />
            <FeaturedPanel title="Now Playing" url={url} />
        </>
    );
}

