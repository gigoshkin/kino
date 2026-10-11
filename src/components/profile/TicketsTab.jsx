import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTickets } from '../../api/tickets';
import Button from '../Button';
import Skeleton from '../Skeleton';
import RefundModal from './RefundModal';
import TicketCard from './TicketCard';

export default function TicketsTab() {
  const [view, setView] = useState('upcoming');
  const [refunding, setRefunding] = useState(null);
  const tickets = useQuery({ queryKey: ['tickets'], queryFn: () => getTickets() });

  if (tickets.isError) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-body-m text-muted">Something went wrong while loading your tickets.</p>
        <Button variant="transparent" onClick={() => tickets.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!tickets.data) {
    return (
      <div className="flex flex-col gap-4">
        {[0, 1].map((item) => (
          <Skeleton key={item} className="h-45.75 animate-pulse rounded-[28px]" />
        ))}
      </div>
    );
  }

  const upcoming = tickets.data.filter((order) => order.isUpcoming);
  const past = tickets.data.filter((order) => !order.isUpcoming);
  const shown = view === 'upcoming' ? upcoming : past;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-fit rounded-xl bg-card p-1.25">
        {[
          { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { id: 'past', label: 'Past', count: past.length },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            className={`flex cursor-pointer items-center gap-2 rounded-[10px] px-3.5 py-1.75 text-label font-semibold ${
              view === item.id ? 'bg-raised' : 'text-muted'
            }`}
          >
            {item.label}
            <span className={`text-label-s ${view === item.id ? 'text-white' : 'text-disabled'}`}>
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="py-10 text-body-m text-muted">
          {view === 'upcoming' ? 'You have no upcoming tickets.' : 'You have no past tickets.'}
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {shown.map((order) => (
            <TicketCard key={order.id} order={order} onRefund={setRefunding} />
          ))}
        </div>
      )}

      {refunding && <RefundModal order={refunding} onClose={() => setRefunding(null)} />}
    </div>
  );
}
