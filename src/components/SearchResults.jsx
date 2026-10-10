import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import Skeleton from './Skeleton';
import { MagnifyingGlassIcon, PopcornIcon } from './icons';

const BROWSE_LINK =
  'inline-flex items-center justify-center rounded-full bg-white/10 px-5.5 py-3.25 text-label font-extrabold ' +
  'hover:bg-white/20 hover:backdrop-blur-[22px] transition-colors ease-out duration-300';

function Poster({ url }) {
  const [status, setStatus] = useState('loading');
  const isLoading = url && status === 'loading';

  return (
    <div
      className={`h-14 w-10 shrink-0 overflow-hidden rounded-md bg-white/10 ${
        isLoading ? 'animate-pulse' : ''
      }`}
    >
      {url && status !== 'error' && (
        <img
          src={url}
          alt=""
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`size-full object-cover transition-opacity duration-300 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}

function formatKind(kind) {
  if (!kind) return null;
  const label = kind.replaceAll('_', ' ');
  return label[0].toUpperCase() + label.slice(1);
}

function formatMeta(movie) {
  return [
    formatKind(movie.kind),
    movie.ageRating?.code,
    movie.runtimeMinutes && `${movie.runtimeMinutes} min`,
  ]
    .filter(Boolean)
    .join(' · ');
}

function Title({ title, query }) {
  const start = query ? title.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (start === -1) return title;
  const end = start + query.length;
  return (
    <>
      {title.slice(0, start)}
      <span className="text-white">{title.slice(start, end)}</span>
      {title.slice(end)}
    </>
  );
}

function Price({ movie }) {
  if (movie.isComingSoon) {
    return <span className="text-label font-semibold text-orange">Coming Soon</span>;
  }
  if (movie.fromPrice == null) return null;
  return <span className="shrink-0 text-label font-semibold">from ₾{movie.fromPrice}</span>;
}

function ResultRow({ movie, query, onSelect }) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      onClick={onSelect}
      className="flex h-18 w-full items-center gap-3.5 rounded-[10px] py-2 pl-2.5 pr-5 hover:bg-white/10"
    >
      <Poster url={movie.posterUrl} />

      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.75">
        <span className="max-w-full truncate text-label font-semibold text-muted">
          <Title title={movie.title} query={query} />
        </span>
        <span className="text-body-s text-muted">{formatMeta(movie)}</span>
      </div>

      <Price movie={movie} />
    </Link>
  );
}

function LoadingState() {
  return (
    <div aria-busy="true" className="w-full animate-pulse">
      <span role="status" className="sr-only">
        Loading results
      </span>
      <div className="flex w-full items-center justify-between px-2.5 pb-1.5 pt-2">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-3 w-14 rounded" />
      </div>
      <div className="flex flex-col gap-0.5">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex h-18 items-center gap-3.5 py-2 pl-2.5 pr-5">
            <Skeleton className="h-14 w-10 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-0.75">
              <Skeleton className="h-3.5 w-3/5 rounded" />
              <Skeleton className="h-3 w-2/5 rounded" />
            </div>
            <Skeleton className="h-3.5 w-14 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Message({ icon, title, text, children }) {
  return (
    <div className="flex w-full flex-col items-center px-6 pb-7 pt-8">
      <div className="flex size-12 items-center justify-center rounded-full bg-white/10 text-white">
        {icon}
      </div>
      <p className="mt-5 text-label font-semibold">{title}</p>
      <p className="mt-1.5 w-95 text-center text-body-m text-muted">{text}</p>
      <div className="mt-5.5">{children}</div>
    </div>
  );
}

export default function SearchResults({
  query,
  isLoading,
  isError,
  results = [],
  onRetry,
  onSelect,
}) {
  const browseLink = (
    <Link to="/sessions" onClick={onSelect} className={BROWSE_LINK}>
      Browse all sessions
    </Link>
  );
  const searchIcon = <MagnifyingGlassIcon width={20} height={20} strokeWidth={0.875} />;

  let content;
  if (!query) {
    content = (
      <Message
        icon={<PopcornIcon />}
        title="What do you want to watch?"
        text="Search by title, director or cast"
      >
        {browseLink}
      </Message>
    );
  } else if (isError) {
    content = (
      <Message
        icon={searchIcon}
        title="Search failed"
        text="Something went wrong while searching. Please try again."
      >
        <Button variant="transparent" onClick={onRetry}>
          Retry
        </Button>
      </Message>
    );
  } else if (isLoading) {
    content = <LoadingState />;
  } else if (results.length === 0) {
    content = (
      <Message
        icon={searchIcon}
        title={`No results for “${query}”`}
        text="Check the spelling or try another film or live event."
      >
        {browseLink}
      </Message>
    );
  } else {
    content = (
      <>
        <div className="flex w-full flex-row items-center justify-between px-2.5 pb-1.5 pt-2">
          <span className="text-label-s font-semibold uppercase tracking-overline text-muted">
            Films &amp; Events
          </span>
          <span className="text-body-s text-muted">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </span>
        </div>
        <div className="flex w-full flex-col gap-0.5">
          {results.map((movie) => (
            <ResultRow key={movie.id} movie={movie} query={query} onSelect={onSelect} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      className="absolute left-0 top-full z-50 mt-1.25 hidden w-120 flex-col rounded-2xl border border-raised bg-page p-2 shadow-[0_2px_6px_0_rgba(0,0,0,0.2),0_20px_48px_-8px_rgba(0,0,0,0.2)] group-focus-within:flex"
    >
      {content}
    </div>
  );
}
