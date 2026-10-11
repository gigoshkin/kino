import Button from './Button';
import Search from './Search';
import NavbarProfile from './NavbarProfile';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, isLoggedIn, openLogin, openRegister } = useAuth();

  return (
    <header className="w-full pt-7.5 pb-10 px-15 flex flex-row items-center justify-between bg-[linear-gradient(180deg,#000_-212.35%,rgba(0,0,0,0.51)_32.09%,rgba(0,0,0,0)_93.93%)]">
      <div className="flex flex-row items-center gap-9">
        <Link className="flex flex-row items-center font-extrabold text-h2" to="/">
          <span className="mr-1.5">KINO</span>
          <span className="text-red">XII</span>
        </Link>
        <nav>
          <ul className="font-semibold tracking-overline uppercase text-label-s">
            <li>
              <Link to="/sessions">Sessions</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex flex-row items-center gap-8">
        <Search />
        {user && <NavbarProfile user={user} />}
        {!user && !isLoggedIn && (
          <div className="flex flex-row items-center gap-3">
            <Button variant="primary" onClick={openRegister}>
              Sign up
            </Button>
            <Button variant="secondary" onClick={openLogin}>
              Log in
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
