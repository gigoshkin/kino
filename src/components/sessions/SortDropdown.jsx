import { useRef, useState } from 'react';
import { ChevronDownIcon } from '../icons';
import useDismiss from '../../hooks/useDismiss';

export default function SortDropdown({ sorts, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const current = sorts.find((sort) => sort.id === value) ?? sorts[0];

  useDismiss(rootRef, isOpen, () => setIsOpen(false));

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex cursor-pointer items-center gap-2 rounded-[10px] pl-4 pr-3.5 text-label"
      >
        <span className="text-body-m font-normal text-muted">Sort:</span>
        <span className="font-extrabold">{current.label}</span>
        <ChevronDownIcon className={isOpen ? 'rotate-180' : ''} />
      </button>

      {isOpen && (
        <ul className="absolute right-0 top-full z-10 mt-2 w-max overflow-clip rounded-xl bg-card py-1 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)]">
          {sorts.map((sort) => (
            <li key={sort.id}>
              <button
                type="button"
                onClick={() => {
                  onChange(sort.id);
                  setIsOpen(false);
                }}
                className={`w-full cursor-pointer px-4 py-2.5 text-left text-label font-semibold hover:bg-white/10 ${
                  sort.id === current.id ? 'text-red' : ''
                }`}
              >
                {sort.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
