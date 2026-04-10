// components/MovieGridReveal.client.tsx
"use client";

import * as React from "react";

type Props = {
    expectedKeys: string[];
    children: React.ReactNode;
    skeleton: React.ReactNode;
};

export default function MovieGridReveal({
    expectedKeys,
    children,
    skeleton,
}: Props) {

    const sortedExpectedKeys = React.useMemo(
        () => expectedKeys.slice().sort(),
        [expectedKeys]
    );

    const expectedKeySignature = React.useMemo(
        () => sortedExpectedKeys.join("|"),
        [sortedExpectedKeys]
    );

    const expectedKeySet = React.useMemo(
        () => new Set(sortedExpectedKeys),
        [sortedExpectedKeys]
    );

    const [ready, setReady] = React.useState<Set<string>>(new Set());

    React.useEffect(() => {
        setReady(new Set());
    }, [expectedKeySignature]);

    React.useEffect(() => {
        function onReady(event: Event) {
            const custom = event as CustomEvent<{ key: string }>;
            const key = custom.detail?.key;

            if (!key) return;
            if (!expectedKeySet.has(key)) return;

            setReady((prev) => {
                if (prev.has(key)) return prev;
                const next = new Set(prev);
                next.add(key);
                return next;
            });
        }

        window.addEventListener("movie-poster-ready", onReady);
        return () => window.removeEventListener("movie-poster-ready", onReady);
    }, [expectedKeySet]);

    const allReady =
        expectedKeys.length === 0 || ready.size >= expectedKeys.length;

    return (
        <div className="relative flex-1 min-h-0">
            {!allReady && skeleton}

            <div
                className={
                    allReady
                        ? "opacity-100 transition-opacity duration-300"
                        : "opacity-0 pointer-events-none absolute inset-0"
                }
                aria-hidden={!allReady}
            >
                {children}
            </div>
        </div>
    );
}