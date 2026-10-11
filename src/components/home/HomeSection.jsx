import { Link } from 'react-router-dom';
import Button from '../Button';

export default function HomeSection({ title, titleClassName, showAll = true, children }) {
  return (
    <section>
      <div className="flex items-end justify-between">
        <h2 className={`font-extrabold ${titleClassName}`}>{title}</h2>
        {showAll && (
          <Link to="/sessions" className="text-label font-semibold text-red">
            See all
          </Link>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function SectionError({ onRetry }) {
  return (
    <div className="flex h-40 flex-col items-start justify-center gap-3">
      <p className="text-body-m text-muted">Something went wrong while loading.</p>
      <Button variant="transparent" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

export function SectionEmpty({ children }) {
  return <p className="flex h-40 items-center text-body-m text-muted">{children}</p>;
}
