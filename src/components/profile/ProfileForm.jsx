import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../../api/auth';
import useAuthedMutation from '../../hooks/useAuthedMutation';
import useFilterOptions from '../../hooks/useFilterOptions';
import { validateMobile, validateName } from '../../utils/validators';
import Button from '../Button';
import TextField from '../TextField';
import { CalendarIcon, CheckIcon, ChevronDownIcon } from '../icons';

function validateBirthDate(value) {
  if (!value) return 'Date of birth is required';

  const date = new Date(`${value}T00:00:00`);
  const today = new Date();

  if (Number.isNaN(date.getTime()) || date > today) return 'Please enter a valid date of birth';

  const minimum = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());

  if (date > minimum) return 'You must be at least 12 years old to create an account';

  return true;
}

function getAgeNotice(age) {
  if (age == null) return null;
  if (age >= 18) return `You are ${age}, you can buy tickets for all age ratings.`;
  if (age >= 16) return `You are ${age}, you cannot buy tickets for 18+ titles.`;

  return `You are ${age}, you cannot buy tickets for 16+ or 18+ titles.`;
}

export default function ProfileForm({ user }) {
  const queryClient = useQueryClient();
  const options = useFilterOptions();
  const [saved, setSaved] = useState(false);

  const defaultValues = {
    fullName: user.fullName ?? '',
    mobileNumber: user.mobileNumber ?? '',
    dateOfBirth: user.dateOfBirth ?? '',
    preferredVenueId: user.preferredVenue ? String(user.preferredVenue.id) : '',
  };

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm({ mode: 'onTouched', defaultValues });

  const save = useAuthedMutation({
    mutationFn: (values) => {
      const formData = new FormData();
      formData.append('fullName', values.fullName.trim());
      formData.append('mobileNumber', values.mobileNumber.replace(/\s/g, ''));
      formData.append('dateOfBirth', values.dateOfBirth);
      if (values.preferredVenueId) formData.append('preferredVenueId', values.preferredVenueId);

      return updateProfile(formData);
    },
    onSuccess: async (updated, values) => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      reset(values);
      setSaved(true);
    },
    onError: (error) => {
      if (error.status === 422 && error.body?.errors) {
        Object.entries(error.body.errors).forEach(([field, messages]) => {
          setError(field, { message: messages[0] });
        });
      }
    },
  });

  const ageNotice = getAgeNotice(user.age);

  return (
    <div className="flex flex-col gap-6">
      {user.profileComplete ? (
        <p className="flex w-fit items-center gap-1.5 rounded-[10px] bg-green/10 px-3 py-2.5 text-label font-semibold text-green">
          Profile Complete
          <CheckIcon />
        </p>
      ) : (
        <p className="w-fit rounded-[10px] bg-orange/10 px-3 py-2.5 text-label font-semibold text-orange">
          Please complete your profile to enable booking.
        </p>
      )}

      <form
        noValidate
        onSubmit={handleSubmit((values) => {
          setSaved(false);
          save.mutate(values);
        })}
        className="flex w-220 flex-col gap-4.5"
      >
        <TextField
          label="Full name"
          placeholder="e.g. Text"
          error={errors.fullName?.message}
          {...register('fullName', { validate: validateName })}
        />
        <TextField
          label="Email"
          value={user.email}
          readOnly
          hint="Set at registration and cannot be changed"
          inputClassName="text-muted"
        />
        <TextField
          label="Mobile number"
          placeholder="e.g. 555 123 456"
          error={errors.mobileNumber?.message}
          {...register('mobileNumber', { validate: validateMobile })}
        />
        <TextField
          label="Date of birth"
          type="date"
          error={errors.dateOfBirth?.message}
          trailing={<CalendarIcon className="shrink-0" />}
          inputClassName="relative [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
          {...register('dateOfBirth', { validate: validateBirthDate })}
        />
        {ageNotice && <p className="-mt-2 text-body-s text-muted">{ageNotice}</p>}
        <label className="flex flex-col gap-2.5 text-label-s font-semibold">
          Preferred Venue (Optional)
          <span className="relative flex h-10 items-center rounded-xl bg-card px-4">
            <select
              className="h-full w-full cursor-pointer appearance-none bg-transparent focus:outline-hidden"
              {...register('preferredVenueId')}
            >
              <option value="">e.g. Text</option>
              {options.data?.venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-4" />
          </span>
          {errors.preferredVenueId && (
            <span className="text-label-s font-semibold text-red">
              {errors.preferredVenueId.message}
            </span>
          )}
        </label>

        <div className="mt-3 flex items-center gap-4">
          <Button type="submit" disabled={!isDirty || save.isPending}>
            {save.isPending ? 'Saving...' : 'Save changes'}
          </Button>
          {saved && <p className="text-label font-semibold text-green">Profile saved</p>}
          {save.isError && save.error.status !== 422 && save.error.status !== 401 && (
            <p className="text-label font-semibold text-red">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
