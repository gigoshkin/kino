import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  const user = {
    fullName: 'Meri Sanikidze',
    username: 'meri',
    avatar: '',
    mobileNumber: '599202860',
    dateOfBirth: '2026-10-10',
    age: 18,
    profileComplete: false,
  };
  return (
    <div className="min-h-[calc(100vh/var(--page-zoom))]">
      <Navbar user={user} />
      <Outlet />
    </div>
  );
}

export default App;
