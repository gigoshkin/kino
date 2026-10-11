import { useNavigate } from 'react-router-dom';
import { formatMoney, formatShortDate } from '../../utils/format';
import Button from '../Button';
import { ConfirmIcon } from '../icons';

function summarizeTickets(tickets) {
  const counts = {};

  tickets.forEach((ticket) => {
    counts[ticket.ticketType.name] = (counts[ticket.ticketType.name] ?? 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => `${count} x ${name}`)
    .join(', ');
}

export default function Confirmation({ order, onClose }) {
  const navigate = useNavigate();
  const { session } = order;

  function go(path) {
    onClose();
    navigate(path);
  }

  return (
    <div className="flex w-168.25 flex-col items-center gap-6 self-center">
      <div className="flex w-full flex-col items-center gap-4.5">
        <div className="flex w-91.25 flex-col items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-[28px] bg-green text-white">
            <ConfirmIcon />
          </div>
          <div className="flex w-full flex-col items-center gap-4">
            <div className="flex w-full flex-col items-center gap-2.5 text-center">
              <h2 className="text-h1 font-extrabold">Booking confirmed!</h2>
              <p className="text-body-m text-muted">
                Your tickets are ready. We&apos;ve sent the confirmation to your email.
              </p>
            </div>
            <p className="rounded-full bg-raised px-5 py-1.5 text-label-s font-semibold">
              ORDER #{order.reference}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 rounded-xl bg-card p-5">
          <div className="flex items-start gap-2.5">
            <div className="h-16 w-12 shrink-0 overflow-clip rounded-lg bg-raised">
              {session.movie.posterUrl && (
                <img src={session.movie.posterUrl} alt="" className="size-full object-cover" />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="text-label font-extrabold uppercase">{session.movie.title}</p>
              <p className="text-body-s text-muted">
                {session.venue.name} · Hall {session.hall.name} · {formatShortDate(session.date)} ·{' '}
                {session.time}
              </p>
            </div>
          </div>
          <div className="h-px w-full bg-raised" />
          <div className="flex items-center justify-between text-body-s">
            <span className="text-muted">Seats</span>
            <span className="font-semibold">
              {order.tickets.map((ticket) => ticket.seatCode).join(', ')}
            </span>
          </div>
          <div className="flex items-center justify-between text-body-s">
            <span className="text-muted">Tickets</span>
            <span>{summarizeTickets(order.tickets)}</span>
          </div>
          <div className="h-px w-full bg-raised" />
          <div className="flex items-center justify-between">
            <span className="text-body-s text-muted">TOTAL PAID</span>
            <span className="text-h3 font-extrabold">
              {formatMoney(order.totalPrice).replace('₾', '₾ ')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button onClick={() => go('/profile?tab=tickets')}>View my tickets</Button>
        <Button variant="transparent" onClick={() => go('/')}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
