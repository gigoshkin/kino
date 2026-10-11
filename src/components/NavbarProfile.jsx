import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { CheckIcon, ChevronDownIcon, LogOutIcon, TicketIcon, UserIcon } from './icons';
import { useAuth } from '../context/useAuth';
import useDismiss from '../hooks/useDismiss';

const MENU_ITEM =
  'flex h-10 w-full items-center gap-2 rounded-[10px] py-2.5 pl-5 text-label font-semibold hover:bg-white/10';

function ProfileStatus({ complete }) {
  if (complete) {
    return (
      <div className="flex items-center gap-1.5 rounded-[10px] bg-green/10 px-3 py-2.5 text-label font-semibold text-green">
        Profile Complete
        <CheckIcon />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 rounded-[10px] bg-orange/10 px-3 py-2.5">
      <p className="text-label font-semibold text-orange">Profile incomplete</p>
      <p className="text-body-s text-muted">Please complete your profile to enable booking</p>
    </div>
  );
}

export default function NavbarProfile({ user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useDismiss(rootRef, isOpen, () => setIsOpen(false));

  const firstName = (user.fullName || user.username).trim().split(/\s+/)[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex cursor-pointer items-center gap-6"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="flex items-center gap-3">
          <Avatar user={user} />
          <span className="text-label font-semibold">{firstName}</span>
        </span>
        <ChevronDownIcon className={isOpen ? 'rotate-180' : ''} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-1.5 flex w-75.5 flex-col gap-1 rounded-2xl bg-page pb-2.5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pl-5 pt-5">
              <Avatar user={user} className="size-10.5" />
              <div className="flex w-47.5 flex-col gap-0.5">
                <p className="truncate text-label font-semibold">
                  {user.fullName || user.username}
                </p>
                <p className="truncate text-body-s text-muted">{user.email}</p>
              </div>
            </div>
            <div className="px-5">
              <ProfileStatus complete={user.profileComplete} />
            </div>
          </div>

          <div className="flex flex-col gap-0.5 pt-1">
            <Link to="/profile" onClick={() => setIsOpen(false)} className={MENU_ITEM}>
              <UserIcon />
              My Profile
            </Link>
            <Link to="/profile?tab=tickets" onClick={() => setIsOpen(false)} className={MENU_ITEM}>
              <TicketIcon />
              My Tickets
            </Link>
          </div>
          <div className="h-px w-full bg-white/10" />
          <button
            type="button"
            onClick={() => {
              navigate('/');
              logout();
            }}
            className={`${MENU_ITEM} cursor-pointer text-red`}
          >
            <LogOutIcon />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
