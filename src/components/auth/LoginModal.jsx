import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import TextField from '../TextField';
import AuthFrame from './AuthFrame';
import { useAuth } from '../../context/useAuth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginModal() {
  const { login, openRegister } = useAuth();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, touchedFields, isValid, isSubmitting },
  } = useForm({ mode: 'onTouched', defaultValues: { email: '', password: '' } });

  async function onSubmit(values) {
    setFormError('');

    try {
      await login(values);
    } catch (err) {
      if (err.status === 422 && err.body?.errors) {
        Object.entries(err.body.errors).forEach(([field, messages]) => {
          setError(field, { message: messages[0] });
        });
      } else if (err.status === 401) {
        setFormError(err.body?.message || 'Invalid credentials.');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    }
  }

  return (
    <AuthFrame title="Log in" subtitle="Welcome back to Kino XII" className="w-100.75">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <TextField
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            error={errors.email?.message}
            isValid={touchedFields.email}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
            })}
          />
          <TextField
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            isValid={touchedFields.password}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 3, message: 'At least 3 characters' },
            })}
          />
          {formError && <p className="text-label-s font-semibold text-red">{formError}</p>}
        </div>

        <div className="flex flex-col items-center gap-6">
          <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </Button>
          <p className="flex items-center gap-1.25 text-body-m text-muted">
            Don&apos;t have an account?
            <button
              type="button"
              onClick={openRegister}
              className="cursor-pointer text-label font-extrabold text-red"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </AuthFrame>
  );
}
