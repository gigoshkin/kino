import { useContext } from 'react';
import { BookingContext } from './bookingContext';

export function useBooking() {
  return useContext(BookingContext);
}
