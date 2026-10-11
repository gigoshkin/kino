import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getTickets } from '../api/tickets';
import Skeleton from '../components/Skeleton';
import ProfileForm from '../components/profile/ProfileForm';
import TicketsTab from '../components/profile/TicketsTab';
import { useAuth } from '../context/useAuth';

export default function Profile() {
  const { user, isLoggedIn, openLogin } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'tickets' ? 'tickets' : 'info';
  const tickets = useQuery({
    queryKey: ['tickets'],
    queryFn: () => getTickets(),
    enabled: isLoggedIn,
  });
  const upcomingCount = tickets.data?.filter((order) => order.isUpcoming).length;

  useEffect(() => {
    if (!isLoggedIn) openLogin();
  }, [isLoggedIn, openLogin]);

  if (!isLoggedIn) {
    return <p className="px-12.75 pt-10 text-body-m text-muted">Log in to see your profile.</p>;
  }

  return (
    <div className="px-12.75 pb-20 pt-1.625">
      <h1 className="text-h1 font-extrabold">My Profile</h1>

      <div className="mt-5.5 flex items-end gap-8.25 border-b border-card">
        {[
          { id: 'info', label: 'Personal Information' },
          { id: 'tickets', label: 'My Tickets' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setParams(item.id === 'tickets' ? { tab: 'tickets' } : {})}
            className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-0.5 pb-3 text-label font-semibold ${
              tab === item.id ? 'border-red' : 'border-transparent text-muted'
            }`}
          >
            {item.label}
            {item.id === 'tickets' && upcomingCount > 0 && (
              <span className="flex size-4.5 items-center justify-center rounded-full bg-red text-[11px] text-white">
                {upcomingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {tab === 'info' ? (
          user ? (
            <ProfileForm user={user} />
          ) : (
            <Skeleton className="h-100 w-220 animate-pulse rounded-xl" />
          )
        ) : (
          <TicketsTab />
        )}
      </div>
    </div>
  );
}
