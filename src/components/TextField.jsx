import { CheckIcon, ErrorIcon } from './icons';

export default function TextField({
  label,
  error,
  isValid,
  type = 'text',
  className = '',
  ...props
}) {
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="flex flex-col gap-2.5 text-label-s font-semibold">
        <span className={hasError ? 'text-red' : 'text-white'}>{label}</span>
        <span
          className={`flex h-10 items-center justify-between gap-1.5 overflow-clip rounded-xl border bg-card px-4 ${
            hasError ? 'border-red text-red' : 'border-transparent text-white'
          }`}
        >
          <input
            type={type}
            className="h-full min-w-0 flex-1 bg-transparent placeholder:text-muted focus:outline-hidden"
            {...props}
          />
          {hasError && <ErrorIcon className="shrink-0 text-red" />}
          {isValid && !hasError && <CheckIcon className="shrink-0 text-green" />}
        </span>
      </label>
      {hasError && <p className="text-label-s font-semibold text-red">{error}</p>}
    </div>
  );
}
