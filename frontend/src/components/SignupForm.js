import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupForm({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/users/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Signup failed');

      setUser(data.user); // Save newly registered user
      navigate('/'); // Redirect to homepage
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">
          Sign Up
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-2 text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />

        <label className="block mb-2 text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />

        <label className="block mb-2 text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-6 p-2 border border-gray-300 rounded focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="text-gray-600 text-sm mt-4 text-center">
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
