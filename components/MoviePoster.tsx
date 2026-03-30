"use client"

import * as React from "react"
import { getTMDBImage, type TMDBPosterSize } from "@/lib/tmbd"
import Image from "next/image"
import { Eye, LucideProps } from 'lucide-react';
import { useRouter } from "next/navigation"
import { WatchStatus } from "@/lib/movieStates";

import { Clock } from 'lucide-react';
import { Pause } from 'lucide-react';
import { Square } from 'lucide-react';
import { Play } from 'lucide-react';
import { Check } from 'lucide-react';
import { Heart } from 'lucide-react';

type MoviePosterProps = {
    posterPath: string | null,
    posterSize?: TMDBPosterSize
    title?: string,
    placement?: number
    allowRedirection?: boolean
    isFavorite?: boolean
    watchStatus?: WatchStatus
    id: number
}
function MoviePosterRaw(props: MoviePosterProps) {
    let imgURL = "https://placehold.co/185x278/png";
    if (props.posterPath !== null) {
        const posterURL = getTMDBImage(props.posterPath, props.posterSize ?? "w185");
        if (posterURL !== null) imgURL = posterURL
    }

    const router = useRouter();

    function goToMovieDetails() {
        router.push(`/movie-details/${props.id}`);
    }

    function getWatchIcon(status?: WatchStatus): React.ReactNode | null {
        if (!status) return null

        switch (status) {
            case WatchStatus.Planning: return <Clock strokeWidth={3} stroke="gray"  />;
            case WatchStatus.Watching: return <Play strokeWidth={3} stroke="green" fill="green" />;
            case WatchStatus.Paused: return <Pause strokeWidth={3} stroke="orange" fill="orange" />;
            case WatchStatus.Dropped: return <Square strokeWidth={3} stroke="red" fill="red" />;
            case WatchStatus.Completed: return <Check strokeWidth={3} stroke="blue" />;
            default: return null
        }
    }

    return (
        <div className="flex flex-col size-full overflow-hidden relative rounded-md bg-stone-900 select-none">

            <div className="relative h-full aspect-[2/3]">
                <Image
                    src={imgURL}
                    alt={props.title ?? "Movie Poster"}
                    fill
                    className="object-cover"
                    loading="eager"
                    quality={60}
                    fetchPriority="high"
                    decoding="async"
                    sizes="(max-width: 768px) 120px, 185px"
                />
                
                {props.placement !== undefined && (
                    <div className="absolute h-full w-full">
                        <div className="absolute right-0 top-0 border-t-50 border-t-black dark:border-t-white border-l-50 border-l-transparent h-0 w-0"></div>
                        <div className="absolute right-0 top-0 p-1 text-white dark:text-black text-l font-bold rotate-45">
                            #{props.placement}
                        </div>
                    </div>
                )}

                {props.title && (
                    <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white text-sm truncate">
                        {props.title}
                    </div>
                )}

                {props.isFavorite && (
                    <div className="absolute top-0 left-0 p-1">
                        <Heart fill="red" />
                    </div>
                )}

                {props.watchStatus && (
                    <div className="absolute h-full w-full">
                        {/* <div className="absolute right-0 top-0 "></div> */}
                        <div className="absolute right-0 top-0 rounded-bl-md bg-black dark:bg-white h-min py-1 px-2 w-min text-white dark:text-black">
                            <div className="flex flex-row gap-1">
                                {getWatchIcon(props.watchStatus)}
                                <span>{props.watchStatus}</span>
                            </div>
                        </div>
                    </div>
                )}

                {(props.allowRedirection ?? false) !== false && (
                    <button onClick={goToMovieDetails} className="text-white z-10 flex flex-col items-center justify-center absolute w-full h-full top-0 left-0 hover:opacity-100 hover:cursor-pointer opacity-0 bg-[#00000080]">
                        <Eye stroke="white" />
                        View details
                    </button>
                )}

            </div>
        </div>
    );
}

const MoviePoster = React.memo(MoviePosterRaw)
export default MoviePoster
