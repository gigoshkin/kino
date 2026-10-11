import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import TextField from '../TextField';
import { UploadIcon } from '../icons';
import AuthFrame from './AuthFrame';
import { useAuth } from '../../context/useAuth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const AVATAR_MAX_SIZE = 2 * 1024 * 1024;

export default function RegisterModal() {
  const { register: registerUser, openLogin } = useAuth();
  const [formError, setFormError] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState('');
  const [preview, setPreview] = useState('');
  const fileInput = useRef(null);

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, touchedFields, isValid, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    e.target.value = '';

    if (!file) return;

    if (!AVATAR_TYPES.includes(file.type)) {
      setAvatarError('Avatar must be a JPG, PNG or WEBP image');
      return;
    }

    if (file.size > AVATAR_MAX_SIZE) {
      setAvatarError('Avatar must be 2MB or smaller');
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setAvatarError('');
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(values) {
    setFormError('');

    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('password_confirmation', values.confirmPassword);
    if (avatar) formData.append('avatar', avatar);

    try {
      await registerUser(formData);
    } catch (err) {
      if (err.status === 422 && err.body?.errors) {
        Object.entries(err.body.errors).forEach(([field, messages]) => {
          if (field === 'avatar') {
            setAvatarError(messages[0]);
          } else {
            setError(field === 'password_confirmation' ? 'confirmPassword' : field, {
              message: messages[0],
            });
          }
        });
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    }
  }

  return (
    <AuthFrame title="Sign up" subtitle="Welcome to Kino XII" className="w-118.75">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInput.current.click()}
              aria-label="Upload avatar"
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center overflow-clip rounded-lg border border-raised bg-white/10 text-disabled"
            >
              {preview ? (
                <img src={preview} alt="" className="size-full object-cover" />
              ) : (
                <UploadIcon />
              )}
            </button>
            <div className="flex flex-col gap-0.75">
              <p className="text-label font-extrabold">Upload avatar (optional)</p>
              <p className="text-body-s text-muted">JPG, PNG or WEBP</p>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          {avatarError && <p className="text-label-s font-semibold text-red">{avatarError}</p>}
        </div>

        <div className="flex flex-col gap-6">
          <TextField
            label="Username"
            placeholder="User"
            error={errors.username?.message}
            isValid={touchedFields.username}
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'At least 3 characters' },
            })}
          />
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
          <div className="flex items-start gap-3">
            <TextField
              label="password"
              type="password"
              placeholder="••••••••"
              className="min-w-0 flex-1"
              error={errors.password?.message}
              isValid={touchedFields.password}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 3, message: 'At least 3 characters' },
              })}
            />
            <TextField
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              className="min-w-0 flex-1"
              error={errors.confirmPassword?.message}
              isValid={touchedFields.confirmPassword}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === getValues('password') || 'Passwords do not match',
              })}
            />
          </div>
          {formError && <p className="text-label-s font-semibold text-red">{formError}</p>}
        </div>

        <div className="flex flex-col items-center gap-6">
          <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
            {isSubmitting ? 'Signing up...' : 'Sign up'}
          </Button>
          <p className="flex items-center gap-1.25 text-body-m text-muted">
            Already have an account?
            <button
              type="button"
              onClick={openLogin}
              className="cursor-pointer text-label font-extrabold text-red"
            >
              Log in
            </button>
          </p>
        </div>
      </form>
    </AuthFrame>
  );
}
