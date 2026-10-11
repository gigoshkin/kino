const VARIANTS = {
  red: 'bg-red/10 text-red',
  white: 'bg-white/10 text-white',
};

export default function Badge({ variant = 'red', className = 'px-1.75 py-1', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full text-label-s font-semibold whitespace-nowrap ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
