// src/components/Header.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  // Function to style active nav links
  const activeClass = ({ isActive }) =>
    isActive
      ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600'
      : 'text-gray-700 hover:text-emerald-600 transition';

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <NavLink to="/" className="text-2xl font-bold text-emerald-600">
        TableReserve
      </NavLink>

      <nav className="flex gap-6 items-center">
        <NavLink to="/" className={activeClass}>
          Home
        </NavLink>
        <NavLink to="/restaurants" className={activeClass}>
          Discover
        </NavLink>

        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-emerald-600 text-white px-4 py-1 rounded hover:bg-emerald-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? 'text-emerald-600 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600 transition'
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive
                  ? 'bg-emerald-700 text-white px-4 py-1 rounded font-semibold'
                  : 'bg-emerald-600 text-white px-4 py-1 rounded hover:bg-emerald-700 transition'
              }
            >
              Sign Up
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
