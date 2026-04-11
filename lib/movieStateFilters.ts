import { WatchStatus } from '@/lib/movieStateTypes';

export type SortingValue =
  | 'release_date.asc'
  | 'release_date.desc'
  | 'title.asc'
  | 'title.desc';

const SortingValues: SortingValue[] = [
  'release_date.asc',
  'release_date.desc',
  'title.asc',
  'title.desc',
];

export const SortingValueLabels: Record<SortingValue, string> = {
  'release_date.asc': 'Release Date (Oldest → Newest)',
  'release_date.desc': 'Release Date (Newest → Oldest)',
  'title.asc': 'Title (A → Z)',
  'title.desc': 'Title (Z → A)',
};

export const SortingValueOptions = Object.entries(SortingValueLabels).map(
  ([value, label]) => ({
    value: value as SortingValue,
    label,
  })
);

export type MovieStatesFilter = {
  is_favorite: boolean;
  watch_statuses: WatchStatus[];
  sort_by: SortingValue;
};

export const defaultMovieStatesFilter: MovieStatesFilter = {
  is_favorite: false,
  watch_statuses: [],
  sort_by: 'title.asc',
};

export function encodeFilterToSearchParams(filter: MovieStatesFilter): URLSearchParams {
  const params = new URLSearchParams();

  if (filter.is_favorite !== defaultMovieStatesFilter.is_favorite) {
    params.set('is_favorite', String(filter.is_favorite));
  }

  if (filter.sort_by !== defaultMovieStatesFilter.sort_by) {
    params.set('sort_by', filter.sort_by);
  }

  const uniqueSorted = Array.from(new Set(filter.watch_statuses)).sort();
  for (const status of uniqueSorted) {
    params.append('watch_statuses', status);
  }

  return params;
}

export function encodeFilterForURL(filter: MovieStatesFilter): string {
  return encodeFilterToSearchParams(filter).toString();
}

const WatchStatusValues = new Set<string>(Object.values(WatchStatus));

function parseBool(value: string | null, fallback: boolean): boolean {
  if (value === null) return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

function parseSortingValue(value: string | null, fallback: SortingValue): SortingValue {
  if (value && SortingValues.includes(value as SortingValue)) {
    return value as SortingValue;
  }
  return fallback;
}

export function decodeFilterFromURL(urlSegment: string): MovieStatesFilter {
  const def = defaultMovieStatesFilter;
  const params = new URLSearchParams(urlSegment);

  const is_favorite = parseBool(params.get('is_favorite'), def.is_favorite);
  const sort_by = parseSortingValue(params.get('sort_by'), def.sort_by);

  const watch_statuses = params
    .getAll('watch_statuses')
    .filter((value): value is WatchStatus => WatchStatusValues.has(value)) as WatchStatus[];

  return {
    is_favorite,
    sort_by,
    watch_statuses,
  };
}