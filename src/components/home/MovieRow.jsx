export default function MovieRow({ gap, children }) {
  return (
    <div className="relative">
      <div
        className={`flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${gap}`}
      >
        {children}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-18.25 bg-linear-to-r from-transparent to-page" />
    </div>
  );
}
