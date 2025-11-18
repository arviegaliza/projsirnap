// src/components/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);

    // Frontend validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setErr('All fields are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErr('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Signup failed');

      setUser(data.user); // Save logged-in user
      navigate('/'); // Redirect to homepage
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-emerald-600 mb-6 text-center">Create an Account</h2>
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {err && <div className="text-red-600 text-center">{err}</div>}

        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Full Name"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="Password"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
        />
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onChange}
          placeholder="Confirm Password"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="text-gray-600 text-sm text-center mt-2">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-emerald-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
