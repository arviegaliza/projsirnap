import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold text-emerald-600">
          TableReserve
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/restaurants" className="text-sm hover:underline">
            Discover
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">Hi, {user.name}</span>
              <button
                className="text-sm px-3 py-1 bg-emerald-600 text-white rounded"
                onClick={() => {
                  setUser(null);
                  navigate('/');
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm px-3 py-1 border rounded"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm px-3 py-1 bg-emerald-600 text-white rounded"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
