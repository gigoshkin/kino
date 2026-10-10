import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSearchResults } from '../api/client';
import useDebounce from '../hooks/useDebounce';
import { ClearIcon, MagnifyingGlassIcon } from './icons';
import SearchResults from './SearchResults';

const PILL_BASE =
  'flex h-10.25 items-center rounded-full bg-white/10 py-1.5 ' +
  'hover:outline-1 hover:-outline-offset-1 hover:outline-white/10';

const PILL_EMPTY =
  'w-95 gap-1 pl-3 pr-3 ' +
  'focus-within:w-full focus-within:pl-5.5 focus-within:backdrop-blur-[7px] ' +
  'focus-within:outline-1 focus-within:-outline-offset-1 focus-within:outline-white/10';

const PILL_FILLED =
  'w-full gap-2 pl-3 pr-2 backdrop-blur-[7px] ' + 'outline-1 -outline-offset-1 outline-white/10';

export default function Search() {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const hasText = query !== '';
  const trimmed = query.trim();
  const debounced = useDebounce(trimmed);

  const { data, isError, refetch } = useQuery({
    queryKey: ['search', debounced],
    queryFn: ({ signal }) => getSearchResults(debounced, signal),
    enabled: debounced !== '',
  });

  const isSettled = trimmed === debounced;

  const isLoading = trimmed !== '' && (!isSettled || (data === undefined && !isError));

  function handleSubmit(e) {
    e.preventDefault();
  }

  function handleClear() {
    setQuery('');
    inputRef.current.focus();
  }

  function handleSelect() {
    setQuery('');
    document.activeElement?.blur();
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') document.activeElement?.blur();
  }

  return (
    <form role="search" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <div className="group relative flex h-10.25 w-120 items-center justify-end">
        <div className={`${PILL_BASE} ${hasText ? PILL_FILLED : PILL_EMPTY}`}>
          <button
            type="submit"
            aria-label="Search"
            className={`shrink-0 text-white ${hasText ? '' : 'group-focus-within:hidden'}`}
          >
            <MagnifyingGlassIcon />
          </button>

          <input
            ref={inputRef}
            type="text"
            name="q"
            autoComplete="off"
            placeholder="Search films and live events"
            aria-label="Search films and live events"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent text-body-m placeholder:text-white focus:outline-hidden focus:placeholder:text-disabled"
          />

          {hasText && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="size-6 shrink-0 cursor-pointer rounded-full bg-white/10 text-white"
            >
              <ClearIcon />
            </button>
          )}
        </div>

        <SearchResults
          query={trimmed}
          isLoading={isLoading}
          isError={isError && isSettled}
          results={data}
          onRetry={() => refetch()}
          onSelect={handleSelect}
        />
      </div>
    </form>
  );
}
