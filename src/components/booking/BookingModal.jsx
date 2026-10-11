import { useEffect, useReducer } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createHold, getSeats, getSession, releaseHold } from '../../api/sessions';
import { useAuth } from '../../context/useAuth';
import useAuthedMutation from '../../hooks/useAuthedMutation';
import useCountdown from '../../hooks/useCountdown';
import useFilterOptions from '../../hooks/useFilterOptions';
import { formatLongDate } from '../../utils/format';
import Button from '../Button';
import Modal from '../Modal';
import Skeleton from '../Skeleton';
import { CloseIcon } from '../icons';
import { bookingReducer, initialState } from './bookingReducer';
import CheckoutStep from './CheckoutStep';
import Confirmation from './Confirmation';
import SeatsStep from './SeatsStep';

const EXPIRED_MESSAGE = 'Your hold time expired. Please re-select your seats.';

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function BookingContent({ session, map, options, onClose, refetchMap }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const seconds = useCountdown(state.step === 'checkout' ? state.hold?.expiresAt : null);

  function failWith(error) {
    if (error.status === 409) {
      dispatch({
        type: 'conflict',
        codes: error.body?.contested ?? [],
        message: error.body?.message ?? 'Some seats were just taken.',
      });
      refetchMap();
      return;
    }

    if (error.status === 422 && error.body?.message && !error.body?.errors) {
      if (error.body.message === EXPIRED_MESSAGE) {
        dispatch({ type: 'expired', message: error.body.message });
        refetchMap();
        return;
      }

      dispatch({ type: 'notice', notice: { type: 'error', text: error.body.message } });
      return;
    }

    dispatch({
      type: 'notice',
      notice: { type: 'error', text: 'Something went wrong. Please try again.' },
    });
  }

  const hold = useAuthedMutation({
    mutationFn: () =>
      createHold(
        session.id,
        state.selected.map(({ seatId, ticketType }) => ({ seatId, ticketType })),
      ),
    onSuccess: (data) => dispatch({ type: 'held', hold: data }),
    onError: failWith,
  });

  useEffect(() => {
    if (seconds === 0) {
      dispatch({ type: 'expired', message: EXPIRED_MESSAGE });
      refetchMap();
    }
  }, [seconds, refetchMap]);

  function close() {
    if (state.hold && state.step !== 'confirmed') {
      releaseHold(state.hold.holdId).catch(() => {});
    }

    queryClient.invalidateQueries({ queryKey: ['seats', session.id] });
    onClose();
  }

  function handlePaid(order) {
    dispatch({ type: 'confirmed', order });
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
    queryClient.invalidateQueries({ queryKey: ['sessions'] });
    queryClient.invalidateQueries({ queryKey: ['movie-sessions'] });
    queryClient.invalidateQueries({ queryKey: ['seats', session.id] });
  }

  return (
    <Modal onClose={close}>
      <div className="flex h-149.75 w-286.5 flex-col gap-8 overflow-clip rounded-[28px] bg-page p-8 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)]">
        {state.step === 'confirmed' ? (
          <Confirmation order={state.order} onClose={close} />
        ) : (
          <>
            <div className="flex items-start gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h2 className="text-h2 font-extrabold uppercase">{session.movie.title}</h2>
                <p className="text-body-s text-muted">
                  {session.venue.name} · Hall {session.hall.name} · {formatLongDate(session.date)} ·{' '}
                  {session.time} · {session.format.name} · {session.language.name}
                </p>
              </div>
              {seconds != null && (
                <div className="flex flex-col items-center gap-0.5 rounded-xl bg-card px-3.5 py-2">
                  <p className="text-label-s font-semibold text-muted">SEATS HELD</p>
                  <p className="text-label font-extrabold">{formatTime(seconds)}</p>
                </div>
              )}
              <button type="button" aria-label="Close" onClick={close} className="cursor-pointer">
                <CloseIcon width={24} height={24} />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 gap-5">
              {state.step === 'seats' ? (
                <SeatsStep
                  map={map}
                  options={options}
                  session={session}
                  state={state}
                  isHolding={hold.isPending}
                  dispatch={dispatch}
                  onNext={() => hold.run()}
                />
              ) : (
                <CheckoutStep
                  session={session}
                  hold={state.hold}
                  user={user}
                  notice={state.notice}
                  onBack={() => dispatch({ type: 'back' })}
                  onPaid={handlePaid}
                  onFailed={failWith}
                />
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

function BookingShell({ onClose, children }) {
  return (
    <Modal onClose={onClose}>
      <div className="flex h-149.75 w-286.5 flex-col gap-8 overflow-clip rounded-[28px] bg-page p-8 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)]">
        {children}
      </div>
    </Modal>
  );
}

export default function BookingModal({ session: preview, onClose }) {
  const options = useFilterOptions();
  const session = useQuery({
    queryKey: ['session', preview.id],
    queryFn: () => getSession(preview.id),
  });
  const seats = useQuery({
    queryKey: ['seats', preview.id],
    queryFn: () => getSeats(preview.id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  const failed = session.isError || seats.isError || options.isError;

  if (failed) {
    return (
      <BookingShell onClose={onClose}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-body-m text-muted">Something went wrong while loading the seats.</p>
          <Button
            variant="transparent"
            onClick={() => {
              session.refetch();
              seats.refetch();
              options.refetch();
            }}
          >
            Retry
          </Button>
        </div>
      </BookingShell>
    );
  }

  if (!session.data || !seats.data || !options.data) {
    return (
      <BookingShell onClose={onClose}>
        <Skeleton className="h-12 w-96 animate-pulse rounded-xl" />
        <Skeleton className="flex-1 animate-pulse rounded-2xl" />
      </BookingShell>
    );
  }

  return (
    <BookingContent
      session={session.data}
      map={seats.data}
      options={options.data}
      onClose={onClose}
      refetchMap={seats.refetch}
    />
  );
}
