import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '@fontsource/archivo/400.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/800.css';

import './index.css';

import { AuthProvider } from './context/AuthProvider';
import App from './App';
import Home from './pages/Home';
import Sessions from './pages/Sessions';
import Movie from './pages/Movie';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<App />}>
              <Route index element={<Home />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="profile" element={<Profile />} />
              <Route path="movie/:slug" element={<Movie />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
