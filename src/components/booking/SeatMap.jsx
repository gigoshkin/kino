const AVAILABLE =
  'cursor-pointer border border-disabled bg-card shadow-[0_1px_2px_rgba(0,0,0,0.2)]';
const SELECTED = 'cursor-pointer border border-page bg-red';
const HELD =
  'bg-card bg-[repeating-linear-gradient(142.56deg,rgba(217,217,217,0.1)_0,rgba(217,217,217,0.1)_9.29px,transparent_9.29px,transparent_18.59px)] text-muted';

function getSeatState(seat, selectedIds, soldCodes) {
  if (selectedIds.includes(seat.id)) return 'selected';
  if (soldCodes.includes(seat.code)) return 'sold';
  if (seat.state === 'available' || seat.isMine) return 'available';

  return seat.state;
}

function Seat({ seat, state, onToggle }) {
  const base =
    'flex size-(--seat) shrink-0 items-center justify-center overflow-clip rounded-[10px] font-extrabold';

  if (state === 'unavailable') {
    return <div className="size-(--seat) shrink-0" />;
  }

  if (state === 'sold') {
    return <div className={`${base} bg-card text-disabled`}>{seat.label}</div>;
  }

  if (state === 'held') {
    return <div className={`${base} ${HELD}`}>{seat.label}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(seat)}
      className={`${base} ${state === 'selected' ? SELECTED : AVAILABLE} ${
        state === 'selected' ? 'text-h3' : 'text-label'
      }`}
    >
      {seat.label}
    </button>
  );
}

function getSeatSize(sections) {
  const rows = sections.flatMap((section) => section.rows);
  const columns = Math.max(...rows.map((row) => row.seats.length));
  const aisles = Math.max(...rows.map((row) => row.seats.filter((seat) => seat.aisleAfter).length));
  const space = 640 - (columns - 1) * 8 - aisles * 16;

  return Math.max(24, Math.min(52, Math.floor(space / columns)));
}

function Legend() {
  return (
    <div className="flex items-start justify-center gap-6 text-body-s text-muted">
      <div className="flex items-center gap-2">
        <span className="size-4 rounded-[5px] border border-disabled bg-card" />
        Available
      </div>
      <div className="flex items-center gap-2">
        <span className="size-4 rounded-[5px] bg-red" />
        Selected
      </div>
      <div className="flex items-center gap-2">
        <span className="size-4 rounded-[5px] bg-card" />
        Sold
      </div>
      <div className="flex items-center gap-2">
        <span className={`size-4 rounded-[5px] ${HELD}`} />
        Held by another user
      </div>
    </div>
  );
}

export default function SeatMap({ map, selectedIds, soldCodes, onToggle }) {
  const size = getSeatSize(map.sections);

  return (
    <div className="flex flex-col gap-8" style={{ '--seat': `${size}px` }}>
      <div className="px-5">
        <div className="flex h-7.5 items-center justify-center rounded-b-[20px] bg-raised px-5 text-label-s font-semibold">
          SCREEN
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        {map.sections.map((section) => (
          <div key={section.name} className="flex flex-col gap-2.5">
            <p className="text-label-s font-semibold uppercase tracking-overline text-muted">
              {section.name} · rows {section.rows[0].label}-
              {section.rows[section.rows.length - 1].label}
            </p>
            {section.rows.map((row) => (
              <div key={row.label} className="flex items-center gap-2">
                <div className="flex h-8 w-5 items-center justify-center text-label-s font-semibold">
                  {row.label}
                </div>
                {row.seats.map((seat) => (
                  <div key={seat.id} className="flex items-center gap-2">
                    <Seat
                      seat={seat}
                      state={getSeatState(seat, selectedIds, soldCodes)}
                      onToggle={onToggle}
                    />
                    {seat.aisleAfter && <div className="h-8 w-4 shrink-0" />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Legend />
    </div>
  );
}
