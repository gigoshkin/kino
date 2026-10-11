export const initialState = {
  step: 'seats',
  selected: [],
  hold: null,
  order: null,
  notice: null,
  soldCodes: [],
};

export function bookingReducer(state, action) {
  switch (action.type) {
    case 'toggle-seat': {
      const exists = state.selected.some((item) => item.seatId === action.seat.id);

      if (exists) {
        return {
          ...state,
          notice: null,
          selected: state.selected.filter((item) => item.seatId !== action.seat.id),
        };
      }

      if (state.selected.length >= action.max) {
        return {
          ...state,
          notice: { type: 'error', text: `You can select up to ${action.max} seats per order.` },
        };
      }

      return {
        ...state,
        notice: null,
        selected: [
          ...state.selected,
          { seatId: action.seat.id, code: action.seat.code, ticketType: 'adult' },
        ],
      };
    }
    case 'remove-seat':
      return {
        ...state,
        notice: null,
        selected: state.selected.filter((item) => item.seatId !== action.seatId),
      };
    case 'set-ticket-type':
      return {
        ...state,
        selected: state.selected.map((item) =>
          item.seatId === action.seatId ? { ...item, ticketType: action.ticketType } : item,
        ),
      };
    case 'held':
      return { ...state, step: 'checkout', hold: action.hold, notice: null };
    case 'back':
      return { ...state, step: 'seats', notice: null };
    case 'conflict':
      return {
        ...state,
        step: 'seats',
        hold: null,
        selected: state.selected.filter((item) => !action.codes.includes(item.code)),
        soldCodes: [...state.soldCodes, ...action.codes],
        notice: {
          type: 'error',
          text: action.codes.length
            ? `Seats ${action.codes.join(', ')} were just taken. Your other seats are still selected.`
            : action.message,
        },
      };
    case 'expired':
      return { ...initialState, notice: { type: 'warning', text: action.message } };
    case 'notice':
      return { ...state, notice: action.notice };
    case 'maps-refreshed':
      return { ...state, soldCodes: [] };
    case 'confirmed':
      return { ...state, step: 'confirmed', order: action.order, hold: null, notice: null };
    default:
      return state;
  }
}
