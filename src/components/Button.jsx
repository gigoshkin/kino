const BASE =
  'inline-flex items-center justify-center gap-1 px-5.5 py-3.25 ' +
  'rounded-full text-sm font-extrabold leading-[normal] cursor-pointer ' +
  'transition-colors duration-300 ease-out ' +
  'disabled:cursor-not-allowed disabled:bg-disabled disabled:text-muted';

const VARIANTS = {
  primary: 'bg-red text-white',
  secondary: 'bg-white text-page',
  transparent:
    'bg-white/10 text-white not-disabled:hover:bg-muted not-disabled:hover:backdrop-blur-[22px]',
};

export default function Button({
  as: Component = 'button',
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}) {
  const typeProps = Component === 'button' ? { type } : {};

  return (
    <Component {...typeProps} {...props} className={`${BASE} ${VARIANTS[variant]} ${className}`}>
      {children}
    </Component>
  );
}
