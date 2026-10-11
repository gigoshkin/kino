import { useState } from 'react';
import { useAuth } from './useAuth';
import { BookingContext } from './bookingContext';

export function BookingProvider({ children }) {
  const { requireAuth } = useAuth();
  const [session, setSession] = useState(null);

  function openBooking(selected) {
    requireAuth(() => setSession(selected));
  }

  function closeBooking() {
    setSession(null);
  }

  return (
    <BookingContext.Provider value={{ session, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}
