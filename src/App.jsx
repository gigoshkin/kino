import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import { useAuth } from './context/useAuth';

function App() {
  const { modal } = useAuth();

  return (
    <div className="min-h-[calc(100vh/var(--page-zoom))]">
      <Navbar />
      <Outlet />
      {modal === 'login' && <LoginModal />}
      {modal === 'register' && <RegisterModal />}
    </div>
  );
}

export default App;
