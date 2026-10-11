import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import { useAuth } from './context/useAuth';

function App() {
  const { modal } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh/var(--page-zoom))] flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {modal === 'login' && <LoginModal />}
      {modal === 'register' && <RegisterModal />}
    </div>
  );
}

export default App;
