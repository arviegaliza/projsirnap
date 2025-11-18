// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home'; // <-- Import Home
import Login from './components/Login';
import Signup from './components/Signup';
import RestaurantList from './components/RestaurantList';
import RestaurantPage from './components/RestaurantPage';

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} setUser={setUser} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
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
