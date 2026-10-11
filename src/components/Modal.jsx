import { useEffect, useRef } from 'react';

const openModals = [];

export default function Modal({ onClose, layer = 'z-50', children }) {
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const entry = {};
    openModals.push(entry);

    function handleKeyDown(e) {
      if (e.key === 'Escape' && openModals[openModals.length - 1] === entry) closeRef.current();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      openModals.splice(openModals.indexOf(entry), 1);

      if (openModals.length === 0) document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center overflow-y-auto bg-[rgba(36,36,36,0.3)] backdrop-blur-[5px] ${layer}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}
