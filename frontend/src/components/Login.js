// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);

    if (!form.email || !form.password) {
      setErr('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login failed');

      setUser(data.user); // Save logged-in user
      navigate('/'); // Redirect to home
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-emerald-600 mb-6 text-center">Login</h2>
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {err && <div className="text-red-600 text-center">{err}</div>}

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="Password"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-gray-600 text-sm text-center mt-2">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-emerald-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
