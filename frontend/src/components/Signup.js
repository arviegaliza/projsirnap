// src/components/Signup.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // set in .env

export default function Signup({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // Animate component on mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Standard email/password signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error or backend unreachable.');
    } finally {
      setLoading(false);
    }
  };

  // Google signup/login
  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    try {
      const token = credentialResponse.credential;
      const res = await fetch(`${API}/api/users/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || 'Google signup/login failed.');
      }
    } catch (err) {
      console.error('Google signup error:', err);
      setError('Google signup/login error.');
    }
  };

  const handleGoogleError = () => setError('Google signup/login failed.');

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 px-4">
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white border border-yellow-100 transform transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-yellow-800 text-center">
          Sign Up
        </h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        {/* Email/Password Signup Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-4 mb-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border px-4 py-2 rounded-lg focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition shadow-sm hover:shadow-md"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border px-4 py-2 rounded-lg focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition shadow-sm hover:shadow-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border px-4 py-2 rounded-lg focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition shadow-sm hover:shadow-md"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="border px-4 py-2 rounded-lg focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition shadow-sm hover:shadow-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition transform hover:scale-[1.02] shadow-md"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {/* Google Signup/Login */}
        <div className="flex flex-col gap-3">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </GoogleOAuthProvider>
        </div>

        {/* Login Link */}
        <p className="mt-4 text-center text-sm text-yellow-800">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
