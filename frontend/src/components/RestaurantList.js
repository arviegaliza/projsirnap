// src/components/RestaurantList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch(`${API}/api/restaurants`);
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter(
    r =>
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      (r.cuisine?.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search restaurants or cuisine"
        className="w-full border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
      />
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length ? (
          filtered.map(r => (
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
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {r.rating ?? '–'} ★ • {r.price_range ?? '–'}
                </div>
                <Link
                  to={`/restaurant/${r.id}`}
                  className="text-sm bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition"
                >
                  View
                </Link>
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
