export default function Footer() {
  return (
    <footer className="flex flex-col gap-5 bg-page px-8.5 pb-8.5 pt-6.75">
      <div className="h-px w-full bg-raised" />
      <div className="flex items-center justify-between">
        <p className="flex gap-1 text-label font-extrabold">
          <span>KINO</span>
          <span className="text-red">XII</span>
        </p>
        <p className="text-body-s text-muted">© 2026 Kino XII. All rights reserved.</p>
      </div>
    </footer>
  );
}
