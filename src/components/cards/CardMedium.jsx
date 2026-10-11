import { useQueryClient } from '@tanstack/react-query';
import { notifyMe } from '../../api/movies';
import useAuthedMutation from '../../hooks/useAuthedMutation';
import { formatDay, formatMeta } from '../../utils/format';
import Badge from '../Badge';
import { BellIcon, CheckIcon } from '../icons';

export default function CardMedium({ movie }) {
  const queryClient = useQueryClient();

  const notify = useAuthedMutation({
    mutationFn: () => notifyMe(movie.slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coming-soon'] }),
  });

  return (
    <div className="flex h-40 w-117.5 shrink-0 items-center gap-3.75 rounded-[20px] bg-card p-3 shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
      <div className="h-full min-w-0 flex-1 overflow-clip rounded-[14px] bg-raised">
        {(movie.backdropUrl || movie.posterUrl) && (
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt=""
            className="size-full object-cover"
          />
        )}
      </div>
      <div className="flex h-33 w-48 shrink-0 flex-col items-start justify-between pr-15">
        <div className="flex flex-col items-start gap-1.75">
          <p className="text-label-s font-semibold uppercase text-red">
            In cinemas {formatDay(movie.releaseDate)}
          </p>
          <div className="flex w-full flex-col gap-1.75">
            <p className="truncate text-label-s font-semibold">{movie.title}</p>
            <p className="truncate text-body-s text-muted">{formatMeta(movie)}</p>
          </div>
          <Badge>{movie.ageRating.code}</Badge>
        </div>
        <button
          type="button"
          disabled={notify.isPending || movie.isNotified}
          onClick={() => notify.run()}
          className="flex cursor-pointer items-center justify-center gap-1 rounded-full border border-muted px-3 py-1.5 text-label-s font-semibold disabled:cursor-default"
        >
          {movie.isNotified ? <CheckIcon /> : <BellIcon />}
          {movie.isNotified
            ? 'Notified'
            : notify.isError && notify.error.status !== 401
              ? 'Try again'
              : 'Notify Me'}
        </button>
      </div>
    </div>
  );
}
