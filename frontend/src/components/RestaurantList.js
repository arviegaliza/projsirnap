// frontend/src/pages/RestaurantList.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
const socket = io(API);

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [q, setQ] = useState('');

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${API}/api/restaurants`);
      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRestaurants();

    // Listen for real-time updates
    socket.on('bookingUpdated', () => {
      fetchRestaurants(); // Refetch all restaurants when a booking occurs
    });

    return () => {
      socket.off('bookingUpdated');
    };
  }, []);

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      r.cuisine?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search restaurants or cuisine"
        className="w-full border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
      />

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length ? (
          filtered.map((r) => (
            <div
              key={r.id}
              className="border rounded p-4 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <h3 className="text-lg font-semibold">{r.name}</h3>
                <p className="text-sm text-gray-500">
                  {r.cuisine} • {r.city}
                </p>
                {r.promo && (
                  <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    {r.promo}
                  </span>
                )}
                <p className="mt-1 text-sm text-gray-600">
                  Available tables: <strong>{r.tables_available ?? '-'}</strong>
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {r.rating ?? '–'} ★ • {r.price_range ?? '–'}
                </div>
                <a
                  href={`/restaurant/${r.id}`}
                  className="text-sm bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition"
                >
                  View
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No restaurants found.</div>
        )}
      </div>
    </div>
  );
}
