import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import '@fontsource/archivo/400.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/800.css';

import './index.css';

import App from './App';
import Home from './pages/Home';
import Sessions from './pages/Sessions';
import Movie from './pages/Movie';
import Profile from './pages/Profile';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="movie/:id" element={<Movie />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
