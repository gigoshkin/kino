import ticketBody from '../../assets/ticket-body.svg';
import { TicketIcon } from '../icons';

export default function SessionTicket({ session, disabled, onSelect }) {
  const isUnavailable = disabled || session.isSoldOut;

  return (
    <button
      type="button"
      disabled={isUnavailable}
      onClick={() => onSelect(session)}
      className="relative flex h-20.25 w-51.75 shrink-0 cursor-pointer items-center justify-between overflow-clip rounded-xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] disabled:cursor-not-allowed"
    >
      <img src={ticketBody} alt="" className="absolute left-0 top-0 h-20.25 w-51.75" />
      <div
        className={`relative flex w-31 flex-col items-center justify-center gap-2 py-3.75 ${
          isUnavailable ? 'opacity-40' : ''
        }`}
      >
        <p className="text-h2 font-extrabold">{session.time}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-body-s text-muted">{session.language.code}</span>
          <span className="rounded-full bg-card px-3 py-1 text-label-s font-semibold text-[rgba(227,227,227,0.7)]">
            {session.format.name}
          </span>
        </div>
      </div>
      <div
        className={`relative flex h-full w-20.75 flex-col items-center justify-center gap-2 px-3.75 py-2.5 ${
          isUnavailable ? 'opacity-40' : ''
        }`}
      >
        <p className="whitespace-nowrap text-h3 font-extrabold text-red">₾ {session.price}</p>
        <div className="flex items-start gap-1 text-body-s text-muted">
          <TicketIcon width={12} height={12} />
          <span className="whitespace-nowrap">
            {session.isSoldOut ? 'Sold out' : `${session.seatsLeft} left`}
          </span>
        </div>
      </div>
      <div className="absolute left-31 top-2.75 h-14.75 w-0 border-l-[1.5px] border-dashed border-white" />
    </button>
  );
}
