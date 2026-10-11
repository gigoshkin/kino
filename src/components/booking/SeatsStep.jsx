import { CloseIcon } from '../icons';
import { formatMoney } from '../../utils/format';
import Button from '../Button';
import SeatMap from './SeatMap';
import StepTabs from './StepTabs';

export function Notice({ notice }) {
  if (!notice) return null;

  const style = notice.type === 'warning' ? 'bg-orange/10 text-orange' : 'bg-red/10 text-red';

  return (
    <p className={`rounded-xl px-3 py-2 text-label-s font-semibold ${style}`}>{notice.text}</p>
  );
}

export default function SeatsStep({ map, options, session, state, isHolding, dispatch, onNext }) {
  const ticketTypes = [...options.ticketTypes]
    .filter(
      (type) =>
        type.blockedFromRatingAge == null ||
        session.movie.ageRating.minAge < type.blockedFromRatingAge,
    )
    .sort((a, b) => a.priceRatio - b.priceRatio);
  const ratios = Object.fromEntries(
    options.ticketTypes.map((type) => [type.slug, type.priceRatio]),
  );
  const subtotal = state.selected.reduce(
    (sum, item) => sum + session.price * ratios[item.ticketType],
    0,
  );

  return (
    <>
      <div className="flex min-h-0 w-180 shrink-0 flex-col gap-6">
        <StepTabs step="seats" />
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:var(--color-raised)_transparent] [scrollbar-width:thin]">
          <SeatMap
            map={map}
            selectedIds={state.selected.map((item) => item.seatId)}
            soldCodes={state.soldCodes}
            onToggle={(seat) =>
              dispatch({ type: 'toggle-seat', seat, max: options.maxSeatsPerOrder })
            }
          />
        </div>
      </div>

      <div className="w-px self-stretch bg-card" />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex h-87.75 flex-col gap-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p className="text-label font-extrabold">Your seats · Max {options.maxSeatsPerOrder}</p>
          <Notice notice={state.notice} />
          {state.selected.length === 0 && (
            <p className="text-body-s text-muted">
              Pick up to {options.maxSeatsPerOrder} seats from the map. Each seat can carry its own
              ticket type.
            </p>
          )}
          {state.selected.map((item) => (
            <div key={item.seatId} className="flex flex-col gap-3 rounded-2xl bg-card p-3.75">
              <div className="flex items-center justify-between text-label-s">
                <div className="flex items-center gap-3">
                  <span className="text-body-s text-muted">Seat</span>
                  <span className="font-semibold">{item.code}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">
                    {formatMoney(session.price * ratios[item.ticketType])}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove seat ${item.code}`}
                    onClick={() => dispatch({ type: 'remove-seat', seatId: item.seatId })}
                    className="cursor-pointer"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
              <div className="h-px w-full bg-raised" />
              <div className="flex gap-2">
                {ticketTypes.map((type) => (
                  <button
                    key={type.slug}
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: 'set-ticket-type',
                        seatId: item.seatId,
                        ticketType: type.slug,
                      })
                    }
                    className={`flex-1 cursor-pointer rounded-2xl py-2 text-body-s ${
                      item.ticketType === type.slug ? 'bg-red' : 'bg-raised'
                    }`}
                  >
                    {type.name} {Math.round(type.priceRatio * 100)}%
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-2.5">
          <div className="flex items-center justify-between px-1.25">
            <p className="text-label-s font-semibold">SUBTOTAL</p>
            <p className="text-h1 font-extrabold">₾ {Number(subtotal.toFixed(2))}</p>
          </div>
          <Button
            disabled={state.selected.length === 0 || isHolding}
            onClick={onNext}
            className="w-full"
          >
            {isHolding ? 'Holding seats...' : 'Next: Checkout'}
          </Button>
        </div>
      </div>
    </>
  );
}
