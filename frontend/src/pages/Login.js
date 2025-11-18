import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState(null);

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setErr('Email and password are required');
      return;
    }
    // Mock login: just set user based on email
    setUser({ name: form.email.split('@')[0] });
    navigate('/');
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
        />
        <button className="px-4 py-2 bg-emerald-600 text-white rounded">Login</button>
        {err && <div className="text-red-600">{err}</div>}
      </form>
    </div>
  );
}
