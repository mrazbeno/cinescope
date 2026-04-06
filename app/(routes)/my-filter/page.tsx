'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MovieStatesFilters } from './MovieStatesFilters';
import {
  defaultMovieStatesFilter,
  DecodeFilterFromURL,
  EncodeFilterForURL,
  fetchMyListPage,
  MyListFetchResult,
} from './filters';
import { useAuth } from '@/components/auth/authProvider';
import PaginatorClient from '@/components/pagination/PaginatorClient';
import MovieGridClient, {
  MovieGridClientSkeleton,
} from '@/components/movie/MovieGridClient';

function parsePage(search: string): number {
  const p = new URLSearchParams(search).get('page');
  const n = Number(p);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export default function MyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

  const search = searchParams.toString();
  const appliedFilter = React.useMemo(() => DecodeFilterFromURL(search), [search]);
  const currentPage = React.useMemo(() => parsePage(search), [search]);

  const [draftFilter, setDraftFilter] = React.useState(defaultMovieStatesFilter);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  React.useEffect(() => {
    setDraftFilter(appliedFilter);
  }, [appliedFilter]);

  const [resp, setResp] = React.useState<MyListFetchResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!auth.loading && !auth.user) router.replace('/login');
  }, [auth.loading, auth.user, router]);

  React.useEffect(() => {
    if (auth.loading || !auth.user) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setResp(null);

        if (auth.user == null) return;

        const listResp = await fetchMyListPage(auth.user.id, appliedFilter, currentPage);

        if (!cancelled) setResp(listResp);
      } catch (e: any) {
        const msg = e?.message ?? 'Failed to load list';
        toast.error(msg);
        if (!cancelled) setResp(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [auth.loading, auth.user, appliedFilter, currentPage]);

  const onSubmit = () => {
    const params = new URLSearchParams(EncodeFilterForURL(draftFilter));
    params.set('page', '1');
    setSheetOpen(false);
    router.push(`/my-filter?${params.toString()}`);
  };

  const onReset = () => {
    setDraftFilter(defaultMovieStatesFilter);
    setSheetOpen(false);
    router.push('/my-filter?page=1');
  };

  const filtersBlock = (
    <div className="flex flex-col gap-4 w-full">
      <MovieStatesFilters value={draftFilter} onChange={setDraftFilter} />

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <Button onClick={onSubmit} className="grow" disabled={loading}>
          Apply filters
        </Button>
        <Button
          className="grow"
          variant="destructive"
          onClick={onReset}
          disabled={loading}
        >
          Reset
        </Button>
      </div>
    </div>
  );

  return (
    <main className="flex flex-col w-full h-full min-h-0 justify-start items-stretch p-4 gap-3">
      <section className="flex flex-col gap-3 w-full">
        <div className="md:hidden">
          <div className='sm:hidden text-sm mb-2 flex flex-row gap-2'>
            Logged in as: 
            <span className=' font-bold'>
{auth.user?.email?.split("@")[0]}
            </span>
            </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter your catalog</SheetTitle>
                <SheetDescription>
                  Adjust filters, then apply them to update the list.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 p-4">
                {filtersBlock}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:block">
          {filtersBlock}
        </div>
      </section>

      <section className="flex flex-col w-full h-full min-h-0 justify-start items-stretch gap-3">
        <section className="relative flex flex-col w-full items-center justify-center shrink-0 gap-2">
          {!resp ? (
            <div className="text-sm text-muted-foreground">
              Found <Skeleton className="inline-block align-middle h-4 w-16" /> results...
            </div>
          ) : (
            <div>
              Found <b>{resp.tmbdListResponse.total_results}</b> results...
            </div>
          )}
        </section>

        <section className="flex flex-col flex-1 min-h-0 w-full">
          {!resp ? (
            <MovieGridClientSkeleton />
          ) : (
            <MovieGridClient
              results={resp.tmbdListResponse.results}
              myListDetails={resp.myListDetails}
            />
          )}
        </section>

        <section className="flex w-full justify-center shrink-0">
          {!resp ? (
            <Skeleton className="w-1/2 h-8" />
          ) : (
            <PaginatorClient
              currentPage={resp.tmbdListResponse.page}
              totalPages={resp.tmbdListResponse.total_pages}
            />
          )}
        </section>
      </section>
    </main>
  );
}