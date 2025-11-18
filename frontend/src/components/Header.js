import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ user, setUser }) {
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-emerald-600">
        TableReserve
      </Link>
      <nav className="flex gap-4 items-center">
        <Link to="/restaurants" className="hover:text-emerald-600 transition">
          Discover
        </Link>
        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.name}</span>
            <button
              onClick={() => {
                setUser(null);
                navigate('/');
              }}
              className="bg-emerald-600 text-white px-4 py-1 rounded hover:bg-emerald-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-emerald-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-emerald-600 text-white px-4 py-1 rounded hover:bg-emerald-700 transition"
            >
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
