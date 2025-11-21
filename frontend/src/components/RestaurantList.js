// src/components/RestaurantList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function RestaurantList() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/restaurants`);
        const data = await res.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setRestaurant(data[0]); // Take only the first café/restaurant
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setRestaurant(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // small internal styles for subtle animations & palette
  const extraStyle = `
    .fade-in { animation: fadeIn 360ms ease both; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0);} }
  `;

  if (loading) return <p className="text-center mt-16 text-gray-500">Loading café...</p>;
  if (!restaurant) return <p className="text-center mt-16 text-gray-500">Café not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 fade-in">
      <style>{extraStyle}</style>
      <h2 className="text-xl font-semibold text-[#4b2e17] mb-4">{restaurant.name}</h2>

      <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow-md p-4">
        <img
          src={restaurant.image || 'https://placehold.co/240x140'}
          alt={restaurant.name}
          className="w-full md:w-64 h-40 rounded-md object-cover flex-shrink-0"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">{restaurant.cuisine} • {restaurant.city}</div>
            <div className="text-xs text-[#8a6a53] mb-2">{restaurant.type}</div>
            <div className="text-xs text-gray-600">Tables Available: {restaurant.tables_available ?? 0}</div>
          </div>
          <Link
            to={`/restaurant/${restaurant.id}`}
            className="mt-3 inline-block text-sm px-4 py-2 border rounded text-[#4b2e17] hover:bg-[#f5efe6] text-center"
          >
            View & Book
          </Link>
        </div>
      </div>
    </div>
  );
}
