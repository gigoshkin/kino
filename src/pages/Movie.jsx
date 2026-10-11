import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getMovie, getMovieSessions } from '../api/movies';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import { TimerIcon } from '../components/icons';
import MovieDetails from '../components/movie/MovieDetails';
import MovieSessionList from '../components/movie/MovieSessionList';
import { useBooking } from '../context/useBooking';
import useAgeGate from '../hooks/useAgeGate';
import { addRecentlyViewed } from '../hooks/useRecentlyViewed';
import { toDays } from '../utils/dates';

function Message({ children, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 px-12.75 py-20">
      <p className="text-body-m text-muted">{children}</p>
      {onRetry ? (
        <Button variant="transparent" onClick={onRetry}>
          Retry
        </Button>
      ) : (
        <Button as={Link} to="/sessions" variant="transparent">
          Browse sessions
        </Button>
      )}
    </div>
  );
}

function MovieContent({ movie }) {
  const { openBooking } = useBooking();
  const { isBlocked, message } = useAgeGate(movie);
  const days = toDays(movie.availableDates.slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(days[0]?.value);

  const sessions = useQuery({
    queryKey: ['movie-sessions', movie.slug, selectedDate],
    queryFn: () => getMovieSessions(movie.slug, selectedDate),
    enabled: Boolean(selectedDate),
  });

  let sessionContent;

  if (!selectedDate) {
    sessionContent = <p className="text-body-m text-muted">No upcoming sessions for this film.</p>;
  } else if (sessions.isError) {
    sessionContent = (
      <div className="flex flex-col items-start gap-3">
        <p className="text-body-m text-muted">Something went wrong while loading.</p>
        <Button variant="transparent" onClick={() => sessions.refetch()}>
          Retry
        </Button>
      </div>
    );
  } else if (!sessions.data) {
    sessionContent = <Skeleton className="h-45 w-full animate-pulse rounded-[18px]" />;
  } else if (sessions.data.length === 0) {
    sessionContent = <p className="text-body-m text-muted">No sessions on this date.</p>;
  } else {
    sessionContent = (
      <MovieSessionList groups={sessions.data} disabled={isBlocked} onSelect={openBooking} />
    );
  }

  return (
    <>
      <div className="relative -mt-27.75 h-141.75 w-full overflow-clip bg-page">
        {movie.backdropUrl && (
          <img
            src={movie.backdropUrl}
            alt=""
            className="absolute inset-0 size-full object-cover object-[50%_29%] blur-[2px]"
          />
        )}
        <div className="absolute inset-0 bg-page/20 backdrop-blur-[5px]" />
        <div className="absolute left-15 top-38 flex items-end gap-8.5">
          <div className="h-93.5 w-72.25 shrink-0 overflow-clip rounded-[14px] bg-raised shadow-[0_4px_64px_rgba(0,0,0,0.2)]">
            {movie.posterUrl && (
              <img src={movie.posterUrl} alt="" className="size-full object-cover" />
            )}
          </div>
          <div className="flex w-145 flex-col items-start gap-3.75 py-2.25">
            <Badge className="px-2.5 py-1.5">
              {movie.isComingSoon ? 'COMING SOON' : 'NOW PLAYING'}
            </Badge>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3.75">
                <h1 className="text-display font-extrabold uppercase">{movie.title}</h1>
                <p className="line-clamp-3 w-140 text-body-m">{movie.synopsis}</p>
              </div>
              <div className="flex gap-1.75">
                <Badge className="px-2.5 py-1.5">{movie.ageRating.code}</Badge>
                <Badge variant="white" className="px-2.5 py-1.5">
                  <TimerIcon width={14} height={14} />
                  {movie.runtimeMinutes} Min
                </Badge>
                {movie.formats.map((format) => (
                  <Badge key={format.id} variant="white" className="px-2.5 py-1.5">
                    {format.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8.5 flex gap-2.5 px-12.75 pb-35">
        <div className="flex min-w-0 flex-1 flex-col gap-6.75 pb-6.5">
          <div className="flex flex-col gap-6">
            <h2 className="text-h2 font-extrabold">Sessions</h2>
            <div className="flex gap-1.75">
              {days.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => setSelectedDate(day.value)}
                  className={`flex size-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl px-2.5 py-2.25 ${
                    selectedDate === day.value ? 'bg-red' : 'bg-card'
                  }`}
                >
                  <span className="text-label-s font-semibold">{day.weekday}</span>
                  <span className="text-h3 font-extrabold">{day.day}</span>
                </button>
              ))}
            </div>
            {isBlocked && <p className="text-label-s font-semibold text-orange">{message}</p>}
          </div>
          {sessionContent}
        </div>
        <MovieDetails movie={movie} />
      </div>
    </>
  );
}

export default function Movie() {
  const { slug } = useParams();
  const movie = useQuery({ queryKey: ['movie', slug], queryFn: () => getMovie(slug) });

  useEffect(() => {
    if (movie.data) addRecentlyViewed(movie.data);
  }, [movie.data]);

  if (movie.isError) {
    return movie.error.status === 404 ? (
      <Message>This film could not be found.</Message>
    ) : (
      <Message onRetry={() => movie.refetch()}>Something went wrong while loading.</Message>
    );
  }

  if (!movie.data) {
    return <Skeleton className="-mt-27.75 h-141.75 animate-pulse" />;
  }

  return <MovieContent key={movie.data.slug} movie={movie.data} />;
}
