// src/components/Header.js
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi'; // Hamburger icons

export default function Header({ user, setUser }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
    setMenuOpen(false);
  };

  const activeClass = ({ isActive }) =>
    isActive
      ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600'
      : 'text-gray-700 hover:text-emerald-600 transition';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-emerald-600">
          TableReserve
        </NavLink>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
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

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-gray-700 focus:outline-none"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <div className="flex flex-col px-6 py-4 gap-4">
            <NavLink
              to="/"
              className={activeClass}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/restaurants"
              className={activeClass}
              onClick={() => setMenuOpen(false)}
            >
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
                  onClick={() => setMenuOpen(false)}
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
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
