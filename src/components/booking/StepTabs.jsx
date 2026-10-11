export default function StepTabs({ step, onSeats }) {
  const isSeats = step === 'seats';

  return (
    <div className="flex w-full gap-2 overflow-clip rounded-full bg-card">
      <button
        type="button"
        disabled={isSeats}
        onClick={onSeats}
        className={`flex flex-1 items-center justify-center rounded-full px-4 py-2.5 text-label-s font-semibold ${
          isSeats ? 'bg-red' : 'cursor-pointer'
        }`}
      >
        SEATS
      </button>
      <div
        className={`flex flex-1 items-center justify-center rounded-full px-4 py-2.5 text-label-s font-semibold ${
          isSeats ? '' : 'bg-red'
        }`}
      >
        CHECKOUT
      </div>
    </div>
  );
}
