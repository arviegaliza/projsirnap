import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });
  const [err, setErr] = useState(null);

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email) {
      setErr('Name and email are required');
      return;
    }
    // Mock signup: just set user
    setUser({ name: form.name });
    navigate('/');
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold mb-4">Sign up</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded"
        />
        <button className="px-4 py-2 bg-emerald-600 text-white rounded">Create account</button>
        {err && <div className="text-red-600">{err}</div>}
      </form>
    </div>
  );
}
