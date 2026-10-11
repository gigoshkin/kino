import { useEffect } from 'react';

export default function useDismiss(ref, isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleMouseDown(e) {
      if (!ref.current.contains(e.target)) onClose();
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, isOpen, onClose]);
}
