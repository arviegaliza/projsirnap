import React, { useState } from 'react';

export default function BookingForm({ restaurantId, onBookingSuccess }) {
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, restaurant_id: restaurantId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');

      onBookingSuccess && onBookingSuccess(data.booking);
      alert('Booking successful!');
      setForm({ customer_name: '', phone: '', date: '', time: '', guests: 1 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reserve a Table</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="text"
        name="customer_name"
        placeholder="Your Name"
        value={form.customer_name}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        required
      />

      <input
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        required
      />

      <input
        type="number"
        name="guests"
        min="1"
        value={form.guests}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
      >
        {loading ? 'Booking...' : 'Book Table'}
      </button>
    </form>
  );
}
