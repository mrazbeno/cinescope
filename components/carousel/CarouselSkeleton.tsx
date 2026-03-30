
import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

import { ArrowUp } from 'lucide-react';
import { ArrowDown } from 'lucide-react';
import clsx from "clsx"

type FeaturedCarouselProps = {
    isDirForward: boolean,
    posterCount: number,
    url: string,
    labelText: string
}

export function CarouselSkeleton(props: FeaturedCarouselProps) {
    return (
        <div className="h-full relative flex select-none flex-col">
            {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="pt-3 shrink min-h-1/4 h-1/4">
                    <div className="flex h-full w-fit">
                        <Skeleton className="h-full aspect-[2/3]"></Skeleton>
                    </div>
                </div>
            ))}
            <div className={clsx("absolute flex items-center justify-between  h-min! w-full p-3 bg-[var(--color-background)] text-[var(--color-foreground)]",
                {
                    "bottom-0": props.isDirForward,
                    "top-0": !props.isDirForward,
                })}>
                {props.labelText}
                {props.isDirForward ? (<ArrowUp />) : (<ArrowDown />)}
            </div>
        </div>
    )
}
