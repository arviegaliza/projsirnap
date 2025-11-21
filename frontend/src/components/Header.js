// src/components/Header.js
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Header({ user, setUser }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
    setMenuOpen(false);
  };

  const activeClass = ({ isActive }) =>
    isActive
      ? 'text-[#4b2e17] font-medium border-b-2 border-[#c9a78a] pb-1'
      : 'text-gray-700 hover:text-[#4b2e17] transition';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="text-lg font-bold text-[#4b2e17]">
          TableReserve
        </NavLink>

        <nav className="hidden md:flex items-center gap-4">
          <NavLink to="/" className={activeClass}>
            Home
          </NavLink>
          <NavLink to="/restaurants" className={activeClass}>
            Restaurants
          </NavLink>

          {user ? (
            <>
              <span className="text-sm text-gray-700">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="ml-2 text-sm bg-[#4b2e17] text-white px-3 py-1 rounded-md hover:bg-[#3f2416] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'text-[#4b2e17] font-medium' : 'text-gray-700 hover:text-[#4b2e17] transition text-sm'
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive
                    ? 'bg-[#4b2e17] text-white px-3 py-1 rounded-md text-sm font-medium'
                    : 'bg-[#6b3e2e] text-white px-3 py-1 rounded-md hover:bg-[#593227] transition text-sm'
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xl text-gray-700 p-1 rounded focus:outline-none"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-white shadow-sm border-t">
          <div className="flex flex-col px-4 py-3 gap-2 text-sm">
            <NavLink to="/" className={activeClass} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/restaurants" className={activeClass} onClick={() => setMenuOpen(false)}>
              Discover
            </NavLink>

            {user ? (
              <div className="flex items-center justify-between gap-2">
            <span className="text-gray-700">Hi, {user.name}</span>

                <button
                  onClick={handleLogout}
                  className="ml-2 text-sm bg-[#4b2e17] text-white px-3 py-1 rounded-md hover:bg-[#3f2416] transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? 'text-[#4b2e17] font-medium' : 'text-gray-700 hover:text-[#4b2e17]')}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-[#4b2e17] text-white px-3 py-1 rounded-md text-sm font-medium'
                      : 'bg-[#6b3e2e] text-white px-3 py-1 rounded-md hover:bg-[#593227] transition text-sm'
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
