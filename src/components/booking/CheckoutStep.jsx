import { useForm } from 'react-hook-form';
import { createOrder } from '../../api/sessions';
import useAuthedMutation from '../../hooks/useAuthedMutation';
import { formatMoney, formatShortDate } from '../../utils/format';
import {
  EMAIL_PATTERN,
  formatCardNumber,
  formatExpiry,
  validateCardNumber,
  validateCvv,
  validateExpiry,
  validateMobile,
  validateName,
} from '../../utils/validators';
import Button from '../Button';
import TextField from '../TextField';
import { Notice } from './SeatsStep';
import StepTabs from './StepTabs';

function summarizeTickets(seats) {
  const counts = {};

  seats.forEach((seat) => {
    counts[seat.ticketType.name] = (counts[seat.ticketType.name] ?? 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => `${count} x ${name}`)
    .join(', ');
}

export default function CheckoutStep({
  session,
  hold,
  user,
  notice,
  onBack,
  onPaid,
  onBusy,
  onFailed,
}) {
  const defaultValues = {
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    mobileNumber: user?.mobileNumber ?? '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  };

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, touchedFields, dirtyFields, isValid },
  } = useForm({ mode: 'onTouched', defaultValues });

  const pay = useAuthedMutation({
    mutationFn: (values) => createOrder({ holdId: hold.holdId, ...values }),
    onMutate: () => onBusy(true),
    onSettled: () => onBusy(false),
    onSuccess: onPaid,
    onError: (error) => {
      if (error.status === 422 && error.body?.errors) {
        Object.entries(error.body.errors).forEach(([field, messages]) => {
          setError(field, { message: messages[0] });
        });
        return;
      }

      if (error.status !== 401) onFailed(error);
    },
  });

  function field(name) {
    const prefilled = defaultValues[name] && !dirtyFields[name];

    return {
      error: errors[name]?.message,
      isValid: touchedFields[name] || dirtyFields[name] || prefilled,
    };
  }

  function formatted(name, format) {
    return {
      onChange: (e) => {
        const value = format(e.target.value);
        e.target.value = value;
        setValue(name, value, { shouldValidate: true });
      },
    };
  }

  return (
    <>
      <div className="flex min-h-0 w-180 shrink-0 flex-col gap-6">
        <StepTabs step="checkout" onSeats={onBack} />
        <form
          id="checkout-form"
          noValidate
          onSubmit={handleSubmit((values) => pay.mutate(values))}
          className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <TextField
            label="Full name"
            placeholder="e.g. Text"
            {...field('fullName')}
            {...register('fullName', { validate: validateName })}
          />
          <div className="flex items-start gap-3">
            <TextField
              label="Email"
              type="email"
              placeholder="e.g. Text"
              className="min-w-0 flex-1"
              {...field('email')}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
              })}
            />
            <TextField
              label="Mobile number"
              placeholder="e.g. 555 123 456"
              className="min-w-0 flex-1"
              {...field('mobileNumber')}
              {...register('mobileNumber', { validate: validateMobile })}
            />
          </div>
          <div className="h-px w-full shrink-0 rounded-full bg-card" />
          <TextField
            label="Card number"
            placeholder="e.g. 1234 4567 8901 2345"
            inputMode="numeric"
            {...field('cardNumber')}
            {...register('cardNumber', {
              validate: validateCardNumber,
              ...formatted('cardNumber', formatCardNumber),
            })}
          />
          <div className="flex items-start gap-3">
            <TextField
              label="Expiry"
              placeholder="e.g. 12/34"
              className="min-w-0 flex-1"
              {...field('expiry')}
              {...register('expiry', {
                validate: validateExpiry,
                ...formatted('expiry', formatExpiry),
              })}
            />
            <TextField
              label="CVV"
              placeholder="e.g. 123"
              inputMode="numeric"
              maxLength={3}
              className="min-w-0 flex-1"
              {...field('cvv')}
              {...register('cvv', { validate: validateCvv })}
            />
          </div>
        </form>
      </div>

      <div className="w-px self-stretch bg-card" />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex h-87.75 flex-col gap-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p className="text-label font-extrabold">Summary</p>
          <Notice notice={notice} />
          <div className="flex flex-col gap-2.5 rounded-xl bg-card p-4">
            <div className="flex flex-col gap-2">
              <p className="text-label font-extrabold uppercase">{session.movie.title}</p>
              <p className="text-body-s text-muted">
                Hall {session.hall.name} · {formatShortDate(session.date)} · {session.time}
              </p>
            </div>
            <div className="h-px w-full bg-raised" />
            <div className="flex items-center justify-between text-body-s">
              <span className="text-muted">Seats</span>
              <span className="font-semibold">
                {hold.seats.map((seat) => seat.code).join(', ')}
              </span>
            </div>
            <div className="flex items-center justify-between text-body-s">
              <span className="text-muted">Tickets</span>
              <span>{summarizeTickets(hold.seats)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2.5">
          <div className="flex items-center justify-between px-1.25">
            <p className="text-label-s font-semibold">SUBTOTAL</p>
            <p className="text-h1 font-extrabold">
              {formatMoney(hold.subtotal).replace('₾', '₾ ')}
            </p>
          </div>
          <Button
            type="submit"
            form="checkout-form"
            disabled={!isValid || pay.isPending}
            className="w-full"
          >
            {pay.isPending ? 'Processing...' : 'Pay: Complete order'}
          </Button>
        </div>
      </div>
    </>
  );
}
