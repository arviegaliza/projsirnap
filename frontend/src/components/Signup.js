// src/components/Signup.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function Signup({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/users/register`, { // <-- fixed to /register
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('Unexpected response:', text);
        throw new Error('Unexpected server response');
      }

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error or backend unreachable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 transition"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-3 text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-emerald-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
