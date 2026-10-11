import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getTickets } from '../api/tickets';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import ProfileForm from '../components/profile/ProfileForm';
import TicketsTab from '../components/profile/TicketsTab';
import { useAuth } from '../context/useAuth';

export default function Profile() {
  const { user, isLoggedIn, isUserError, refetchUser, openLogin } = useAuth();
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
    <div className="px-12.75 pb-20 pt-[6.5px]">
      <h1 className="text-h1 font-extrabold">My Profile</h1>

      <div className="mt-7 flex items-end gap-8 border-b border-card">
        {[
          { id: 'info', label: 'Personal Information' },
          { id: 'tickets', label: 'My Tickets' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setParams(item.id === 'tickets' ? { tab: 'tickets' } : {})}
            className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-0.5 pb-3.5 text-label font-semibold ${
              tab === item.id ? 'border-red' : 'border-transparent text-muted'
            }`}
          >
            {item.label}
            {item.id === 'tickets' && upcomingCount > 0 && (
              <span className="rounded-full bg-red px-1.5 py-0.5 text-label-s font-semibold">
                {upcomingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className={tab === 'tickets' ? 'mt-9' : 'mt-10'}>
        {tab === 'info' ? (
          user ? (
            <ProfileForm user={user} />
          ) : isUserError ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-body-m text-muted">Something went wrong while loading.</p>
              <Button variant="transparent" onClick={() => refetchUser()}>
                Retry
              </Button>
            </div>
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
