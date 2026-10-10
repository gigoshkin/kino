import { useState } from 'react';

function getInitials(name, maxInitials = 2) {
  if (!name || typeof name !== 'string') return '';

  const words = name.trim().split(/\s+/);

  if (words.length === 0 || words[0] === '') return '';

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  let initials = [];

  if (maxInitials === 2) {
    initials = [words[0].charAt(0), words[words.length - 1].charAt(0)];
  } else {
    initials = words.slice(0, maxInitials).map((word) => word.charAt(0));
  }

  return initials.join('').toUpperCase();
}

export default function NavbarProfile({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      className="flex flex-row items-center gap-6"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      onClick={() => setIsOpen((currentState) => !currentState)}
    >
      <span className="size-10 relative flex items-center justify-center bg-card rounded-lg">
        {user.avatar ? (
          <div className="w-full h-full overflow-hidden rounded-lg">
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <span className="text-white text-label-s font-semibold">
            {getInitials(user.fullName)}
          </span>
        )}
        <span
          className={`absolute w-2 h-2 right-0 bottom-0 rounded-full ring-1 ring-page ${user.profileComplete ? 'bg-green' : 'bg-orange'}`}
        ></span>
      </span>
    </button>
  );
}
