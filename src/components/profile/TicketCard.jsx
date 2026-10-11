import { formatMoney, formatRefundDeadline, formatShortDate } from '../../utils/format';
import Badge from '../Badge';
import Button from '../Button';

function Meta({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-label-s font-semibold uppercase tracking-overline text-muted">{label}</p>
      <p className="text-label font-semibold">{children}</p>
    </div>
  );
}

export default function TicketCard({ order, onRefund }) {
  const { session } = order;
  const isRefunded = order.status === 'refunded';

  return (
    <div className="flex overflow-clip rounded-[28px] bg-card">
      <div className="flex min-w-0 flex-1 gap-5 p-6">
        <div className="h-33.5 w-25 shrink-0 overflow-clip rounded-xl bg-raised">
          {session.movie.posterUrl && (
            <img src={session.movie.posterUrl} alt="" className="size-full object-cover" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <div className="flex items-center gap-3">
            <h3 className="text-h2 font-extrabold">{session.movie.title}</h3>
            <Badge>{session.movie.ageRating.code}</Badge>
            <span className="text-body-m text-muted">{session.movie.runtimeMinutes} min</span>
          </div>
          <div className="flex gap-10">
            <Meta label="Date">
              {formatShortDate(session.date)} · {session.time}
            </Meta>
            <Meta label="Venue">
              {session.venue.name} · Hall {session.hall.name}
            </Meta>
            <Meta label="Format">
              {session.format.name} · {session.language.name}
            </Meta>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-1 text-label-s font-semibold uppercase tracking-overline text-muted">
              Seats
            </p>
            {order.tickets.map((ticket) => (
              <span
                key={ticket.id}
                className="rounded-lg bg-raised px-2.5 py-1 text-label-s font-semibold"
              >
                {ticket.seatCode} · {ticket.ticketType.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-83 shrink-0 flex-col justify-center gap-3 border-l border-dashed border-raised px-6 py-6">
        <div className="flex flex-col gap-1">
          <p className="text-label-s font-semibold uppercase tracking-overline text-muted">Order</p>
          <p className="text-label font-semibold">#{order.reference}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-label text-muted">{isRefunded ? 'Refunded' : 'Total paid'}</p>
          <p className="text-h1 font-extrabold">{formatMoney(order.totalPrice)}</p>
        </div>
        {order.isUpcoming && (
          <>
            <Button
              variant="transparent"
              disabled={!order.isRefundable}
              onClick={() => onRefund(order)}
              className="w-full"
            >
              Refund
            </Button>
            <p className="text-center text-body-s text-muted">
              {order.isRefundable
                ? `Refundable until ${formatRefundDeadline(session.startsAt)}`
                : 'Refunds close 2 hours before the session'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
