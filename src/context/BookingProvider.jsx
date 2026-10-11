import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import BookingModal from '../components/booking/BookingModal';
import { useAuth } from './useAuth';
import { BookingContext } from './bookingContext';

export function BookingProvider({ children }) {
  const { requireAuth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  function openBooking(selected) {
    requireAuth(() => {
      const user = queryClient.getQueryData(['me']);

      if (user && !user.profileComplete) {
        navigate('/profile', {
          state: { notice: 'Please complete your profile to enable booking.' },
        });
        return;
      }

      setSession(selected);
    });
  }

  function closeBooking() {
    setSession(null);
  }

  return (
    <BookingContext.Provider value={{ session, openBooking, closeBooking }}>
      {children}
      {session && <BookingModal key={session.id} session={session} onClose={closeBooking} />}
    </BookingContext.Provider>
  );
}
