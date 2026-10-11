import { useMemo } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getSessions } from '../api/sessions';
import Button from '../components/Button';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import FilterSidebar from '../components/sessions/FilterSidebar';
import MovieSessions from '../components/sessions/MovieSessions';
import SortDropdown from '../components/sessions/SortDropdown';
import { useBooking } from '../context/useBooking';
import useFilterOptions from '../hooks/useFilterOptions';
import { getNextDays } from '../utils/dates';

function readList(params, key) {
  const value = params.get(key);

  return value ? value.split(',') : [];
}

function ErrorMessage({ onRetry }) {
  return (
    <div className="flex flex-col items-start gap-3 py-10">
      <p className="text-body-m text-muted">Something went wrong while loading.</p>
      <Button variant="transparent" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

function SessionsSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-8">
      {[0, 1, 2].map((group) => (
        <div key={group} className="flex flex-col gap-3.5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-14 rounded-lg" />
            <Skeleton className="h-5 w-48 rounded-md" />
          </div>
          <div className="flex gap-3 overflow-clip">
            {[0, 1, 2, 3, 4].map((card) => (
              <Skeleton key={card} className="h-26 w-63 shrink-0 rounded-2xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Sessions() {
  const [params, setParams] = useSearchParams();
  const { openBooking } = useBooking();
  const options = useFilterOptions();
  const days = useMemo(() => getNextDays(7), []);

  const venueSlugs = readList(params, 'venues');
  const allowedFormats =
    options.data && venueSlugs.length > 0
      ? new Set(
          options.data.venues
            .filter((venue) => venueSlugs.includes(venue.slug))
            .flatMap((venue) => venue.formats.map((format) => format.slug)),
        )
      : null;
  const sortFromUrl = params.get('sort');
  const hasValidSort = !options.data || options.data.sorts.some((sort) => sort.id === sortFromUrl);

  const filters = {
    venues: venueSlugs,
    formats: readList(params, 'formats').filter(
      (slug) => !allowedFormats || allowedFormats.has(slug),
    ),
    languages: readList(params, 'languages'),
    bands: readList(params, 'bands'),
    date: days.some((day) => day.value === params.get('date')) ? params.get('date') : days[0].value,
    sort: sortFromUrl && hasValidSort ? sortFromUrl : 'time_asc',
    page: Number(params.get('page')) || 1,
  };

  const sessions = useQuery({
    queryKey: ['sessions', filters],
    queryFn: () => getSessions(filters),
    placeholderData: keepPreviousData,
    enabled: Boolean(options.data),
  });

  function update(changes, keepPage = false) {
    const next = new URLSearchParams(params);

    Object.entries(changes).forEach(([key, value]) => {
      const text = Array.isArray(value) ? value.join(',') : value;

      if (text) next.set(key, text);
      else next.delete(key);
    });

    if (!keepPage) next.delete('page');

    setParams(next);
  }

  function clearFilters() {
    update({ venues: [], formats: [], languages: [], bands: [] });
  }

  function changePage(page) {
    update({ page: page > 1 ? page : '' }, true);
    window.scrollTo({ top: 0 });
  }

  const result = sessions.data;
  const groups = result?.data ?? [];
  const meta = result?.meta;
  const hasFilters =
    filters.venues.length +
      filters.formats.length +
      filters.languages.length +
      filters.bands.length >
    0;

  let content;

  if (sessions.isError) {
    content = <ErrorMessage onRetry={() => sessions.refetch()} />;
  } else if (!result) {
    content = <SessionsSkeleton />;
  } else if (groups.length === 0) {
    content = (
      <div className="flex flex-col items-start gap-3 py-10">
        <p className="text-body-m text-muted">No sessions match your filters for this day.</p>
        {hasFilters && (
          <Button variant="transparent" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    );
  } else {
    content = (
      <div
        className={`flex flex-col gap-8 transition-opacity ${sessions.isPlaceholderData ? 'opacity-50' : ''}`}
      >
        {groups.map((group, index) => (
          <div key={group.movie.id} className="flex flex-col gap-8">
            {index > 0 && <div className="h-px w-full bg-raised" />}
            <MovieSessions movie={group.movie} sessions={group.sessions} onSelect={openBooking} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-12.75 pb-34 pt-1.625">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-h1 font-extrabold">Sessions</h1>
        <p className="text-body-m text-muted">Browse showtimes across all venues</p>
      </div>

      <div className="mt-9 flex items-start gap-12.75">
        <div className="w-80 shrink-0">
          {options.isError && <ErrorMessage onRetry={() => options.refetch()} />}
          {options.isPending && <Skeleton className="h-150 animate-pulse rounded-2xl" />}
          {options.data && (
            <FilterSidebar
              options={options.data}
              filters={filters}
              days={days}
              onChange={update}
              onClear={clearFilters}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-label font-semibold">
              {meta
                ? meta.totalSessions === 0
                  ? 'No sessions found'
                  : `Showing ${meta.totalSessions} sessions`
                : ' '}
            </p>
            {options.data && (
              <SortDropdown
                sorts={options.data.sorts}
                value={filters.sort}
                onChange={(sort) => update({ sort })}
              />
            )}
          </div>

          <div className="mt-6">{content}</div>

          {meta && (
            <div className="mt-13">
              <Pagination page={meta.currentPage} lastPage={meta.lastPage} onChange={changePage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
