import { useRef } from 'react';

export default function MovieRow({ gap, children }) {
  const rowRef = useRef(null);
  const drag = useRef(null);

  function handlePointerDown(e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;

    drag.current = { x: e.clientX, left: rowRef.current.scrollLeft, moved: false };
  }

  function handlePointerMove(e) {
    if (!drag.current) return;

    const distance = e.clientX - drag.current.x;

    if (Math.abs(distance) > 5) drag.current.moved = true;
    if (drag.current.moved) rowRef.current.scrollLeft = drag.current.left - distance;
  }

  function handlePointerUp() {
    setTimeout(() => {
      drag.current = null;
    });
  }

  function handleClick(e) {
    if (drag.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <div className="relative">
      <div
        ref={rowRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClickCapture={handleClick}
        onDragStart={(e) => e.preventDefault()}
        className={`flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${gap}`}
      >
        {children}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-18.25 bg-linear-to-r from-transparent to-page" />
    </div>
  );
}
