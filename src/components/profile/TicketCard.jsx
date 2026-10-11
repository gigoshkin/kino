import { formatMoney, formatRefundDeadline, formatShortDate } from '../../utils/format';
import Badge from '../Badge';
import Button from '../Button';

function Meta({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-label-s font-semibold uppercase tracking-overline text-muted">{label}</p>
      <p className="text-label font-semibold">{children}</p>
    </div>
  );
}

export default function TicketCard({ order, onRefund }) {
  const { session } = order;
  const isRefunded = order.status === 'refunded';
  const canRefund = order.isUpcoming && order.isRefundable;

  let note = 'Refunds close 2 hours before the session';

  if (canRefund) note = `Refundable until ${formatRefundDeadline(session.startsAt)}`;
  else if (isRefunded) note = 'This order has been refunded';

  return (
    <div className="flex overflow-clip rounded-[26px] bg-card">
      <div className="flex min-w-0 flex-1 items-center gap-4.5 px-7.5">
        <div className="h-[133.5px] w-25 shrink-0 overflow-clip rounded-[10px] bg-raised">
          {session.movie.posterUrl && (
            <img src={session.movie.posterUrl} alt="" className="size-full object-cover" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-h2 font-extrabold uppercase">{session.movie.title}</h3>
            <Badge className="px-2 py-0.75">{session.movie.ageRating.code}</Badge>
            <span className="text-body-m text-muted">{session.movie.runtimeMinutes} min</span>
          </div>
          <div className="flex flex-col gap-3">
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
              <p className="text-label-s font-semibold uppercase tracking-overline text-muted">
                Seats
              </p>
              {order.tickets.map((ticket) => (
                <span
                  key={ticket.id}
                  className="rounded-md bg-white/10 px-2.5 py-1 text-label-s font-semibold"
                >
                  {ticket.seatCode} · {ticket.ticketType.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex w-75 shrink-0 flex-col gap-4 px-6 py-5">
        <div className="absolute inset-y-0 left-0 w-px bg-[repeating-linear-gradient(to_bottom,#2a2c3d_0,#2a2c3d_6px,transparent_6px,transparent_12px)]" />
        <div className="flex flex-col gap-0.5">
          <p className="text-label-s font-semibold uppercase tracking-overline text-muted">Order</p>
          <p className="text-label font-semibold">#{order.reference}</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <p className="text-label font-semibold text-muted">
              {isRefunded ? 'Refunded' : 'Total paid'}
            </p>
            <p className="text-h1 font-extrabold">{formatMoney(order.totalPrice)}</p>
          </div>
          <Button
            variant="transparent"
            disabled={!canRefund}
            onClick={() => onRefund(order)}
            className="w-full py-2.5! disabled:bg-white/10! disabled:text-white! disabled:opacity-20"
          >
            Refund
          </Button>
          <p className="text-center text-body-s text-muted">{note}</p>
        </div>
      </div>
    </div>
  );
}
