import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Email and password are required');

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok || data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-3 text-sm text-gray-600">
        Don't have an account? <Link to="/signup" className="text-emerald-600 hover:underline">Sign Up</Link>
      </p>
    </div>
  );
}
