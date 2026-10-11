import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../Badge';
import Button from '../Button';
import { ArrowLeftIcon, TicketIcon, TimerIcon } from '../icons';
import { formatDay } from '../../utils/format';

const SLIDE_MS = 6000;

export default function Hero({ movies }) {
  const [index, setIndex] = useState(0);
  const count = movies.length;

  useEffect(() => {
    const timer = setTimeout(() => setIndex((current) => (current + 1) % count), SLIDE_MS);

    return () => clearTimeout(timer);
  }, [index, count]);

  const movie = movies[index];

  function goTo(next) {
    setIndex((next + count) % count);
  }

  return (
    <div className="relative -mt-27.75 h-190 w-full overflow-clip bg-page">
      {movies.map((item, i) => (
        <img
          key={item.id}
          src={item.backdropUrl}
          alt=""
          className={`absolute inset-0 size-full object-cover object-[50%_29%] transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-linear-to-l from-black/8 to-black/80" />

      <div
        key={movie.id}
        className="absolute bottom-44.75 left-16.75 flex w-145 animate-fade-in flex-col gap-3.75"
      >
        <div>
          <Badge className="px-2.5 py-1.5">
            PREMIERE · WEEK OF {formatDay(movie.releaseDate, 'short').toUpperCase()}
          </Badge>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3.75">
            <h1 className="text-display font-extrabold uppercase">{movie.title}</h1>
            <div className="flex gap-2">
              <Badge className="px-3 py-1.5">{movie.ageRating.code}</Badge>
              <Badge variant="white" className="px-3 py-1.5">
                <TimerIcon width={14} height={14} />
                {movie.runtimeMinutes} Min
              </Badge>
              {movie.formats.map((format) => (
                <Badge key={format.id} variant="white" className="px-3 py-1.5">
                  {format.name}
                </Badge>
              ))}
            </div>
            <p className="line-clamp-3 w-140 text-body-m">{movie.synopsis}</p>
          </div>
          <div className="flex gap-2.5">
            <Button as={Link} to={`/movie/${movie.slug}`}>
              <TicketIcon />
              Buy tickets
            </Button>
            <Button as={Link} to="/sessions" variant="transparent">
              All sessions
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10.5 left-1/2 flex w-398.5 -translate-x-1/2 items-center gap-5">
        <div className="flex flex-1 gap-1.75">
          {movies.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show ${item.title}`}
              onClick={() => goTo(i)}
              className="relative h-0.75 flex-1 cursor-pointer overflow-clip rounded-full bg-white"
            >
              {i < index && <span className="absolute inset-0 bg-red" />}
              {i === index && (
                <span className="absolute inset-0 origin-left animate-progress bg-red" />
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => goTo(index - 1)}
            className="flex size-13.5 cursor-pointer items-center justify-center rounded-full bg-page/20"
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => goTo(index + 1)}
            className="flex size-13.5 cursor-pointer items-center justify-center rounded-full bg-page/20"
          >
            <ArrowLeftIcon className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
