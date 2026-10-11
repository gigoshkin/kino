import { formatDay } from '../../utils/format';

function Detail({ label, children }) {
  return (
    <div className="flex flex-col gap-1.75 font-semibold">
      <p className="text-label-s uppercase text-muted">{label}</p>
      <p className="text-label">{children}</p>
    </div>
  );
}

export default function MovieDetails({ movie }) {
  return (
    <aside className="flex w-110.25 shrink-0 flex-col gap-4.25 rounded-[20px] px-6.5">
      <h2 className="text-h2 font-extrabold">Details</h2>
      {movie.director && <Detail label="Director">{movie.director}</Detail>}
      {movie.cast && <Detail label="Main cast">{movie.cast}</Detail>}
      <Detail label="Duration">{movie.runtimeMinutes} minutes</Detail>
      <Detail label="Release date">
        {formatDay(movie.releaseDate, 'long') + ' ' + movie.releaseDate.slice(0, 4)}
      </Detail>
      <Detail label="Formats">{movie.formats.map((format) => format.name).join(', ')}</Detail>
      <Detail label="From">₾{movie.fromPrice}</Detail>
      <div className="flex flex-col gap-1.75 rounded-xl bg-orange/10 px-3.25 py-2.25 text-label-s text-orange">
        <p className="font-semibold uppercase">Rating note</p>
        <div className="flex items-start gap-1.75">
          <p className="font-semibold">{movie.ageRating.code}</p>
          <p className="min-w-0 flex-1 text-body-s">{movie.ageRating.description}</p>
        </div>
      </div>
    </aside>
  );
}
