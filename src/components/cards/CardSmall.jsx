import { Link } from 'react-router-dom';
import Badge from '../Badge';
import { formatMeta } from '../../utils/format';

export default function CardSmall({ movie }) {
  return (
    <Link
      to={`/movie/${movie.slug}`}
      className="flex w-82.25 shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-card p-2.25 transition-shadow duration-300 ease-out hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
    >
      <div className="h-16.75 min-w-0 flex-1 overflow-clip rounded-lg bg-raised">
        {(movie.backdropUrl || movie.posterUrl) && (
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt=""
            className="size-full object-cover"
          />
        )}
      </div>
      <div className="flex w-52.5 shrink-0 flex-col gap-1.75">
        <div className="flex flex-col gap-1.75">
          <p className="truncate text-label font-extrabold uppercase">{movie.title}</p>
          <p className="text-body-s text-muted">{formatMeta(movie)}</p>
        </div>
        <div>
          <Badge>{movie.ageRating.code}</Badge>
        </div>
      </div>
    </Link>
  );
}
