// src/components/SignupForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE || 'https://coffeenivincent.onrender.com';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      alert('Signup successful! You can now login.');
      navigate('/login'); // redirect to login page
    } catch (err) {
      console.error(err);
      setError('Network error');
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
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border px-3 py-2 rounded"
          required
        />
        <button type="submit" className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700">
          Sign Up
        </button>
      </form>
    </div>
  );
}
