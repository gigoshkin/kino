import Badge from '../Badge';
import useAgeGate from '../../hooks/useAgeGate';
import SessionTimeCard from './SessionTimeCard';

export default function MovieSessions({ movie, sessions, onSelect }) {
  const { isBlocked, message } = useAgeGate(movie);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center gap-4">
        <div className="h-20 w-14 shrink-0 overflow-clip rounded-lg bg-raised">
          {movie.posterUrl && (
            <img src={movie.posterUrl} alt="" className="size-full object-cover" />
          )}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <p className="text-h3 font-extrabold">{movie.title}</p>
            <Badge className="px-2 py-1">{movie.ageRating.code}</Badge>
          </div>
          <p className="text-body-m text-muted">{movie.runtimeMinutes} min</p>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sessions.map((session) => (
          <SessionTimeCard
            key={session.id}
            session={session}
            disabled={isBlocked}
            title={isBlocked ? message : undefined}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
