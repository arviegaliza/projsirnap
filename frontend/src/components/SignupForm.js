// src/components/SignupForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE || 'https://coffeenivincent.onrender.com';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
      const res = await fetch(`${API}/api/users/signup`, {
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
        console.error('Non-JSON response:', text);
        throw new Error('Unexpected server response');
      }

      if (!res.ok) {
        setError(data.message || data.error || 'Signup failed');
        return;
      }

      alert('Signup successful! You can now login.');
      navigate('/login'); // redirect to login page
    } catch (err) {
      console.error(err);
      setError('Network error or backend unreachable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:border-emerald-500 focus:ring focus:ring-emerald-200"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:border-emerald-500 focus:ring focus:ring-emerald-200"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:border-emerald-500 focus:ring focus:ring-emerald-200"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
