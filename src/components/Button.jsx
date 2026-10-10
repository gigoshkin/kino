const BASE =
  'inline-flex items-center justify-center gap-1 px-5.5 py-3.25 ' +
  'rounded-full text-sm font-extrabold leading-[normal] cursor-pointer ' +
  'disabled:cursor-not-allowed disabled:bg-disabled disabled:text-muted';

const VARIANTS = {
  primary: 'bg-red text-white',
  secondary: 'bg-white text-page',
  transparent:
    'bg-white/10 text-white enabled:hover:bg-white/20 enabled:hover:backdrop-blur-[22px]',
};

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button type={type} {...props} className={`${BASE} ${VARIANTS[variant]} ${className}`}>
      {children}
    </button>
  );
}
