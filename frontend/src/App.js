// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import RestaurantList from './components/RestaurantList';
import RestaurantPage from './components/RestaurantPage';
import 'leaflet/dist/leaflet.css';

export default function App() {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial render
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} setUser={setUser} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />

          {/* Login & Signup */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" /> : <Signup setUser={setUser} />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
