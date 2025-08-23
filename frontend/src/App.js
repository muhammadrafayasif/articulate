import './stylesheets/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics, track } from '@vercel/analytics/react';
import React from 'react';
import { useLocation } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Post from './pages/post';

function AnalyticsTracker() {
  const location = useLocation();

  React.useEffect(() => {
    track('pageview', { path: location.pathname });
  }, [location]);

  return null;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Analytics />
        <AnalyticsTracker />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/post/:id' element={<Post />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;