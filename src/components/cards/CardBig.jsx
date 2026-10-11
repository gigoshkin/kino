import { Link } from 'react-router-dom';
import Badge from '../Badge';
import { formatMeta } from '../../utils/format';

export default function CardBig({ movie }) {
  return (
    <Link
      to={`/movie/${movie.slug}`}
      className="group flex h-113 w-65 shrink-0 flex-col gap-2.5 rounded-[20px] bg-card p-3 shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[width,padding] duration-300 ease-linear hover:w-111.75 hover:p-3.75 hover:ring-1 hover:ring-inset hover:ring-raised"
    >
      <div className="h-75 w-full shrink-0 overflow-clip rounded-[14px] bg-raised transition-[height] duration-300 ease-linear group-hover:h-56">
        {movie.posterUrl && <img src={movie.posterUrl} alt="" className="size-full object-cover" />}
      </div>
      <div className="flex flex-col gap-1.75">
        <div className="flex flex-col gap-1.75">
          <p className="truncate text-h3 font-extrabold">{movie.title}</p>
          <p className="text-body-s text-muted">{formatMeta(movie)}</p>
        </div>
        <div>
          <Badge>{movie.ageRating.code}</Badge>
          <div className="max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] duration-300 ease-linear group-hover:max-h-17 group-hover:opacity-100">
            <p className="line-clamp-3 w-99.25 pt-3 text-body-m text-muted">{movie.synopsis}</p>
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <p className="text-label-s font-semibold">From ₾ {movie.fromPrice}</p>
        <span className="rounded-full bg-red px-5.5 py-2.5 text-label font-extrabold">
          Buy Ticket
        </span>
      </div>
    </Link>
  );
}
