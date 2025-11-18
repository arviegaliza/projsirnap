import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function Signup({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Email and password are required');
    if (password !== confirm) return alert('Passwords do not match');

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error signing up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
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
        Already have an account? <Link to="/login" className="text-emerald-600 hover:underline">Login</Link>
      </p>
    </div>
  );
}
