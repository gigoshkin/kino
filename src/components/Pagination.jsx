import { ArrowLeftIcon } from './icons';

function getPages(current, last) {
  if (last <= 5) return Array.from({ length: last }, (_, i) => i + 1);

  const pages = new Set([1, 2, current - 1, current, current + 1, last]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b);
  const result = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push('...');
    result.push(page);
  });

  return result;
}

const BUTTON = 'flex size-10 items-center justify-center rounded-full text-body-m';

export default function Pagination({ page, lastPage, onChange }) {
  if (lastPage <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={`${BUTTON} cursor-pointer bg-card enabled:hover:bg-raised disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ArrowLeftIcon width={16} height={16} />
      </button>
      {getPages(page, lastPage).map((item, index) =>
        item === '...' ? (
          <span key={`gap-${index}`} className={`${BUTTON} text-muted`}>
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`${BUTTON} cursor-pointer ${item === page ? 'bg-red' : 'text-muted hover:bg-raised'}`}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={page === lastPage}
        onClick={() => onChange(page + 1)}
        className={`${BUTTON} cursor-pointer bg-card enabled:hover:bg-raised disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ArrowLeftIcon width={16} height={16} className="rotate-180" />
      </button>
    </nav>
  );
}
