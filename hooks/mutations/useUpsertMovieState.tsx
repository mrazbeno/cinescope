'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabaseBrowser';
import { MovieStateRow, movieUpsertStatesKey } from '@/lib/movieStates';
import { toast } from 'sonner';

type Patch = Partial<Pick<MovieStateRow, 'is_favorite' | 'watch_status' | 'title' | 'poster_path' | "release_date">>;

async function upsertMovieState(input: {
    userId: string;
    tmdbMovieId: string;
    patch: Patch;
}) {
    const { userId, tmdbMovieId, patch } = input;

    const { error } = await supabase
        .from('movie_statuses')
        .upsert(
            { user_id: userId, tmdb_movie_id: tmdbMovieId, ...patch },
            { onConflict: 'user_id,tmdb_movie_id' }
        );

    if (error) throw error;
}

export function useUpsertMovieState(userId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: upsertMovieState,

        onMutate: async ({ tmdbMovieId, patch }) => {
            await qc.cancelQueries({ queryKey: movieUpsertStatesKey(userId, [tmdbMovieId]) });

            const snapshots = qc.getQueriesData<MovieStateRow[]>({ queryKey: movieUpsertStatesKey(userId, [tmdbMovieId]) });

            for (const [key, old] of snapshots) {
                if (!old) continue;

                const idx = old.findIndex(r => r.tmdb_movie_id === tmdbMovieId);

                let next: MovieStateRow[];

                if (idx >= 0) {
                    next = old.map(r =>
                        r.tmdb_movie_id === tmdbMovieId ? { ...r, ...patch } : r
                    );
                } else {
                    const inserted: MovieStateRow = {
                        tmdb_movie_id: tmdbMovieId,
                        is_favorite: false,
                        watch_status: null,
                        title: null,
                        poster_path: null,
                        release_date: null,
                        ...patch,
                    };

                    next = [inserted, ...old];
                }

                qc.setQueryData(key, next);
            }

            return { snapshots };
        },

        onError: (_err, _vars, ctx) => {
            toast.error(_err.message)
            if (!ctx?.snapshots) return;
            for (const [key, data] of ctx.snapshots) qc.setQueryData(key, data);
        },

        // optional, revalidate 
        onSettled: () => {
            //   qc.invalidateQueries({ queryKey: ['movieStates'] });
        },
    });
}