// frontend/src/components/BookingForm.js
import React, { useState } from 'react';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function BookingForm({ restaurant, socket }) {
  const [name, setName] = useState('');
  const [tables, setTables] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableTables, setAvailableTables] = useState(restaurant.tables_available ?? 0);

  // Listen for real-time updates from server
  React.useEffect(() => {
    if (!socket) return;

    const handleBookingUpdated = (update) => {
      if (update.restaurantId === restaurant.id) {
        setAvailableTables(prev => prev - update.tablesBooked);
      }
    };

    socket.on('bookingUpdated', handleBookingUpdated);

    return () => {
      socket.off('bookingUpdated', handleBookingUpdated);
    };
  }, [socket, restaurant.id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (tables > availableTables) {
      alert(`Only ${availableTables} tables available`);
      return;
    }

    setLoading(true);
    try {
      await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId: restaurant.id, name, tables }),
      });

      // Reset form
      setName('');
      setTables(1);

      // Emit real-time event to server
      if (socket) {
        socket.emit('bookingUpdated', { restaurantId: restaurant.id, tablesBooked: tables });
      }

      alert('Booking successful!');
    } catch (e) {
      console.error(e);
      alert('Booking failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleBooking} className="flex flex-col gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
        className="border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
      />
      <input
        type="number"
        min="1"
        max={availableTables}
        value={tables}
        onChange={(e) => setTables(Number(e.target.value))}
        required
        className="border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
      />
      <div className="text-sm text-gray-600">
        Available tables: <strong>{availableTables}</strong>
      </div>
      <button
        type="submit"
        disabled={loading || availableTables === 0}
        className={`px-4 py-2 rounded text-white transition ${
          availableTables === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
        }`}
      >
        {loading ? 'Booking...' : 'Book'}
      </button>
    </form>
  );
}
