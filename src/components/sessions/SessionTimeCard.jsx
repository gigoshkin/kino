import { TicketIcon } from '../icons';

const LOW_SEATS = 10;

export default function SessionTimeCard({ session, disabled, title, onSelect }) {
  const isSoldOut = session.isSoldOut;
  const isLow = session.seatsLeft < LOW_SEATS;

  return (
    <button
      type="button"
      disabled={disabled || isSoldOut}
      title={title}
      onClick={() => onSelect(session)}
      className="flex w-63 shrink-0 cursor-pointer flex-col rounded-2xl bg-card p-3.75 text-left disabled:cursor-not-allowed"
    >
      <div className={`flex w-full flex-col gap-3 ${disabled || isSoldOut ? 'opacity-40' : ''}`}>
        <div className="flex w-full items-center justify-between">
          <p className="text-h3 font-extrabold">{session.time}</p>
          <span className="rounded-full bg-raised px-2.5 py-1.25 text-label-s font-semibold">
            {session.format.name}
          </span>
        </div>
        <div className="flex w-full items-start gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 text-body-s">
            <p className="whitespace-nowrap text-muted">{session.language.name}</p>
            <p className="font-semibold">
              {session.venue.name} · Hall {session.hall.name}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end justify-center gap-2.5">
            <div className="flex h-3.25 w-14 items-center justify-end gap-1 text-body-s">
              {isSoldOut ? (
                <span className="text-muted">Sold out</span>
              ) : (
                <>
                  <TicketIcon
                    width={12}
                    height={12}
                    className={isLow ? 'text-red' : 'text-green'}
                  />
                  <span className={isLow ? 'text-red' : 'text-green'}>
                    {session.seatsLeft} left
                  </span>
                </>
              )}
            </div>
            <p className="text-label font-extrabold">₾{session.price}</p>
          </div>
        </div>
      </div>
    </button>
  );
}
