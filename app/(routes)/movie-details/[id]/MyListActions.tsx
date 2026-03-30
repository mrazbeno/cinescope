'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/components/auth/authProvider';
import { supabase } from '@/lib/supabaseBrowser';
import { intitialMovieStateRow, MovieStateRow, WatchStatus, WatchStatusOptions } from '@/lib/movieStates';

interface MyListActionsProps {
  movieId: string;
  title?: string;
  poster_path?: string | null;
  release_date?: string;
}

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

async function upsertMovieState(userId: string, tmdbMovieId: string, patch: Partial<MovieStateRow>) {
  const { error } = await supabase
    .from('movie_statuses')
    .upsert({ user_id: userId, tmdb_movie_id: tmdbMovieId, ...patch }, { onConflict: 'user_id,tmdb_movie_id' });

  if (error) throw new Error(error.message);
}

async function fetchMovieState(tmdbId: string): Promise<MovieStateRow> {
  const { data, error } = await supabase
    .from('movie_statuses')
    .select('tmdb_movie_id,is_favorite,watch_status,title,poster_path,release_date')
    .eq('tmdb_movie_id', tmdbId)
    .limit(1);

  if (error) throw new Error(error.message);
  return (data?.[0] as MovieStateRow) ?? intitialMovieStateRow;
}

export default function MyListActions(props: MyListActionsProps) {
  const auth = useAuth();
  const userId = auth.user?.id ?? '';
  const tmdbMovieId = props.movieId;

  const [loadState, setLoadState] = React.useState<LoadState>('idle');
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [state, setState] = React.useState<MovieStateRow>(intitialMovieStateRow);
  const [pending, setPending] = React.useState(false);
  const opIdRef = React.useRef(0);

  React.useEffect(() => {
   
    if (!userId) {
      setLoadState('idle');
      setLoadError(null);
      setState(intitialMovieStateRow);
      return;
    }

    let cancelled = false;
    setLoadState('loading');
    setLoadError(null);

    (async () => {
      try {
        const row = await fetchMovieState(tmdbMovieId);
        if (cancelled) return;
        setState(row);
        setLoadState('ready');
      } catch (e: any) {
        if (cancelled) return;
        setLoadError(e?.message ?? 'Failed to load');
        setLoadState('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, tmdbMovieId]);

  const setFavorite = async (next: boolean) => {
    if (!userId || pending) return;

    setPending(true);
    const opId = ++opIdRef.current;

    try {
      await upsertMovieState(userId, tmdbMovieId, {
        is_favorite: next,
        ...(props.title ? { title: props.title } : {}),
        ...(props.poster_path !== undefined ? { poster_path: props.poster_path } : {}),
        ...(props.release_date ? { release_date: props.release_date } : {}),
      });

      if (opId === opIdRef.current) {
        setState(s => ({ ...s, is_favorite: next }));
      }
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to update favorite');
    } finally {
      if (opId === opIdRef.current) setPending(false);
    }
  };

  const setWatchStatus = async (next: WatchStatus | null) => {
    if (!userId || pending) return;

    setPending(true);
    const opId = ++opIdRef.current;

    try {
      await upsertMovieState(userId, tmdbMovieId, {
        watch_status: next,
        ...(props.title ? { title: props.title } : {}),
        ...(props.poster_path !== undefined ? { poster_path: props.poster_path } : {}),
        ...(props.release_date ? { release_date: props.release_date } : {}),
      });

      if (opId === opIdRef.current) {
        setState(s => ({ ...s, watch_status: next }));
      }
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to update watch status');
    } finally {
      if (opId === opIdRef.current) setPending(false);
    }
  };

  const selectValue = state.watch_status ?? undefined;

  const baseControls = (
    <div className="flex items-center gap-2 p-2">
      <Button aria-hidden variant="outline" disabled>
        <Heart fill="transparent" />
      </Button>
      <Select aria-hidden disabled>
        <SelectTrigger aria-hidden>
          <SelectValue aria-hidden placeholder="Select a watch status..." />
        </SelectTrigger>
      </Select>
    </div>
  );

  // not logged in => disabled controls, overlay sign-in CTA
  if (!userId) {
    return (
      <div className="relative w-min rounded-md">
        {baseControls}
        <div className="absolute inset-0 rounded-md backdrop-blur-[2px] bg-muted/50 flex items-center justify-center px-3 text-sm">
          <Link className="font-semibold hover:underline" href="/login">
            Sign in
          </Link>
          <span className="ml-2">to track movie</span>
        </div>
      </div>
    );
  }

  // logged in, loading or error => disabled controls, overlay message
  if (loadState === 'loading' || loadState === 'error') {
    return (
      <div className="relative w-min rounded-md">
        {baseControls}
        <div className="absolute inset-0 rounded-md backdrop-blur-[2px] bg-muted/50 flex items-center justify-center px-3 text-sm">
          {loadState === 'loading' ? (
            <span className="text-muted-foreground">Loading…</span>
          ) : (
            <span className="text-destructive">{loadError ?? 'Failed to load'}</span>
          )}
        </div>
      </div>
    );
  }

  //  ready
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        disabled={pending}
        onClick={() => setFavorite(!state.is_favorite)}
      >
        <Heart fill={state.is_favorite ? 'red' : 'transparent'} />
      </Button>

      <Select
        value={selectValue}
        disabled={pending}
        onValueChange={(v) => setWatchStatus((v || null) as WatchStatus | null)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a watch status..." />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Watch statuses</SelectLabel>
            {WatchStatusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
