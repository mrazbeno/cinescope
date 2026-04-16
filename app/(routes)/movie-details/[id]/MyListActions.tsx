'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import { useAuth } from '@/components/auth/authProvider';
import {
  MovieStateRow,
  intitialMovieStateRow,
  WatchStatus,
  WatchStatusOptions,
} from '@/lib/movieStateTypes';
import {
  fetchMovieState,
  upsertMovieState,
  type MovieStatePatch,
} from '@/lib/movieStateApi';

interface MyListActionsProps {
  movieId: string;
  title?: string;
  poster_path?: string | null;
  release_date?: string;
}

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

function DisabledOverlay({
  children,
  overlay,
}: {
  children: React.ReactNode;
  overlay: React.ReactNode;
}) {
  return (
    <div className="relative w-min rounded-md">
      {children}
      <div className="absolute inset-0 flex items-center justify-center rounded-md bg-muted/50 px-3 text-sm backdrop-blur-[2px]">
        {overlay}
      </div>
    </div>
  );
}

export default function MyListActions(props: MyListActionsProps) {
  const auth = useAuth();
  const userId = auth.user?.id ?? '';
  const tmdbMovieId = props.movieId;

  const [loadState, setLoadState] = React.useState<LoadState>('idle');
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [state, setState] = React.useState<MovieStateRow>(intitialMovieStateRow);
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    if (!userId) {
      setLoadState('idle');
      setLoadError(null);
      setState(intitialMovieStateRow);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoadState('loading');
      setLoadError(null);

      try {
        const row = await fetchMovieState(userId, tmdbMovieId);
        if (cancelled) return;

        setState(row);
        setLoadState('ready');
      } catch (error: any) {
        if (cancelled) return;

        setLoadError(error?.message ?? 'Failed to load');
        setLoadState('error');
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [userId, tmdbMovieId]);

  const metadataPatch = React.useMemo<MovieStatePatch>(
    () => ({
      ...(props.title ? { title: props.title } : {}),
      ...(props.poster_path !== undefined ? { poster_path: props.poster_path } : {}),
      ...(props.release_date ? { release_date: props.release_date } : {}),
    }),
    [props.title, props.poster_path, props.release_date]
  );

  const updateMovieState = async (
    patch: MovieStatePatch,
    errorMessage: string
  ) => {
    if (!userId || pending) return;

    setPending(true);

    try {
      await upsertMovieState({
        userId,
        tmdbMovieId,
        patch: {
          ...metadataPatch,
          ...patch,
        },
      });

      setState((current) => ({
        ...current,
        ...patch,
      }));
    } catch (error: any) {
      toast.error(error?.message ?? errorMessage);
    } finally {
      setPending(false);
    }
  };

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

  if (!userId) {
    return (
      <DisabledOverlay
        overlay={
          <>
            <Link className="font-semibold hover:underline" href="/sign-in">
              Sign in
            </Link>
            <span className="ml-2">to track movie</span>
          </>
        }
      >
        {baseControls}
      </DisabledOverlay>
    );
  }

  if (loadState === 'loading' || loadState === 'error') {
    return (
      <DisabledOverlay
        overlay={
          loadState === 'loading' ? (
            <span className="text-muted-foreground">Loading…</span>
          ) : (
            <span className="text-destructive">{loadError ?? 'Failed to load'}</span>
          )
        }
      >
        {baseControls}
      </DisabledOverlay>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        disabled={pending}
        onClick={() =>
          updateMovieState(
            { is_favorite: !state.is_favorite },
            'Failed to update favorite'
          )
        }
      >
        <Heart fill={state.is_favorite ? 'red' : 'transparent'} />
      </Button>

      <Select
        value={state.watch_status ?? undefined}
        disabled={pending}
        onValueChange={(value) =>
          updateMovieState(
            { watch_status: (value || null) as WatchStatus | null },
            'Failed to update watch status'
          )
        }
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